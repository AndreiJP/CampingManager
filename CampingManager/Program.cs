using System.Text;
using CampingManager.Data;
using CampingManager.Authorization;
using CampingManager.Interfaces;
using CampingManager.Options;
using CampingManager.Services;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// Add services to the container.

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(
        builder.Environment.ContentRootPath,
        ".data-protection-keys")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AdminFrontend", policy =>
    {
        var allowedOrigins = builder.Configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>() ?? [];

        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services
    .AddOptions<JwtSettings>()
    .Bind(builder.Configuration.GetSection("Jwt"))
    .ValidateDataAnnotations()
    .Validate(settings => settings.SecretKey.Length >= 32, "JWT secret key must be at least 32 characters.")
    .Validate(
        settings => !builder.Environment.IsProduction() || !IsUnsafeJwtSecret(settings.SecretKey),
        "JWT secret key must be configured from a production secret source.")
    .ValidateOnStart();

builder.Services
    .AddOptions<AdminBootstrapOptions>()
    .Bind(builder.Configuration.GetSection("AdminBootstrap"))
    .ValidateDataAnnotations()
    .Validate(options => !options.Enabled || !string.IsNullOrWhiteSpace(options.SetupToken),
        "Admin bootstrap setup token is required when bootstrap is enabled.")
    .Validate(options => !options.Enabled || options.SetupToken!.Length >= 16,
        "Admin bootstrap setup token must be at least 16 characters.")
    .Validate(options => !builder.Environment.IsProduction() || !options.Enabled || options.SetupToken!.Length >= 32,
        "Admin bootstrap setup token must be at least 32 characters in production.")
    .ValidateOnStart();

var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>() ?? throw new InvalidOperationException("Jwt settings are missing.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
            ClockSkew = TimeSpan.FromMinutes(1)
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (string.IsNullOrWhiteSpace(context.Token) &&
                    context.Request.Cookies.TryGetValue(AdminAuthConstants.AccessTokenCookieName, out var accessToken))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AdminAuthConstants.AdminPolicy, policy =>
        policy.RequireRole(AdminAuthConstants.AdminRole));
});

builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IReservationService, ReservationService>();
builder.Services.AddScoped<IPitchService, PitchService>();
builder.Services.AddScoped<ICampingEquipmentTypeService, CampingEquipmentTypeService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSingleton<IClock, SystemClock>();

builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier;
    };
});

builder.Services.AddHealthChecks();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("AdminBootstrap", limiterOptions =>
    {
        limiterOptions.PermitLimit = 3;
        limiterOptions.QueueLimit = 0;
        limiterOptions.Window = TimeSpan.FromMinutes(10);
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var problemDetails = new ValidationProblemDetails(context.ModelState)
        {
            Title = "Validation failed",
            Status = StatusCodes.Status400BadRequest,
            Detail = "One or more validation errors occurred.",
            Instance = context.HttpContext.Request.Path
        };

        return new BadRequestObjectResult(problemDetails);
    };
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Insert the JWT token only. The Bearer prefix is added automatically."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            []
        }
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.Use(async (context, next) =>
{
    context.Response.Headers.TryAdd("X-Trace-Id", context.TraceIdentifier);

    using var scope = app.Logger.BeginScope(new Dictionary<string, object>
    {
        ["TraceId"] = context.TraceIdentifier
    });

    await next(context);
});

app.UseRouting();
app.UseCors("AdminFrontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();

static bool IsUnsafeJwtSecret(string secretKey)
{
    return secretKey.Equals("CHANGE_ME_USE_ENVIRONMENT_VARIABLE_IN_PRODUCTION", StringComparison.Ordinal) ||
        secretKey.StartsWith("dev-only-", StringComparison.OrdinalIgnoreCase);
}
