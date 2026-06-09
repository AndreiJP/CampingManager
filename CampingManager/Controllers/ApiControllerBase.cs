using CampingManager.Services;
using CampingManager.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampingManager.Controllers
{
    [Authorize(Policy = AdminAuthConstants.AdminPolicy)]
    public abstract class ApiControllerBase : ControllerBase
    {
        protected ActionResult ToErrorResult<T>(ServiceResult<T> result)
        {
            var message = result.ErrorMessage ?? "The request could not be completed.";

            return result.ErrorType switch
            {
                ServiceErrorType.NotFound => Problem(
                    title: "Resource not found",
                    detail: message,
                    statusCode: StatusCodes.Status404NotFound),

                ServiceErrorType.Conflict => Problem(
                    title: "Request conflict",
                    detail: message,
                    statusCode: StatusCodes.Status409Conflict),

                ServiceErrorType.Validation => Problem(
                    title: "Validation failed",
                    detail: message,
                    statusCode: StatusCodes.Status400BadRequest),

                ServiceErrorType.Unauthorized => Problem(
                    title: "Authentication failed",
                    detail: message,
                    statusCode: StatusCodes.Status401Unauthorized),

                _ => Problem(
                    title: "Request failed",
                    detail: message,
                    statusCode: StatusCodes.Status400BadRequest)
            };
        }
    }
}
