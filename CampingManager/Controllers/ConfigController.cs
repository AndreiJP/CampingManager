using Microsoft.AspNetCore.Mvc;

namespace CampingManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfigController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ConfigController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public ActionResult GetConfig()
        {
            var siteConfig = _configuration.GetSection("SiteConfig");
            if (!siteConfig.Exists())
            {
                return NotFound("Site configuration not found.");
            }

            var experiences = siteConfig.GetSection("Experiences").GetChildren().Select(x => new
            {
                Title = x["Title"],
                Description = x["Description"],
                ImageUrl = x["ImageUrl"]
            }).ToList();

            return Ok(new
            {
                SiteName = siteConfig["SiteName"],
                LogoIcon = siteConfig["LogoIcon"],
                HeroTitle = siteConfig["HeroTitle"],
                Address = siteConfig["Address"],
                Email = siteConfig["Email"],
                Phone = siteConfig["Phone"],
                OpeningHours = siteConfig["OpeningHours"],
                FacebookUrl = siteConfig["FacebookUrl"],
                InstagramUrl = siteConfig["InstagramUrl"],
                TwitterUrl = siteConfig["TwitterUrl"],
                Experiences = experiences
            });
        }
    }
}
