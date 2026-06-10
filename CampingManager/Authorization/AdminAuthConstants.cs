namespace CampingManager.Authorization
{
    public static class AdminAuthConstants
    {
        public const string AdminRole = "Admin";
        public const string AdminPolicy = "AdminOnly";
        public const string AccessTokenCookieName = "CampingManager.Admin.AccessToken";
        public const string SetupTokenHeaderName = "X-Setup-Token";
    }
}
