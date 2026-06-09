namespace CampingManager.Services
{
    public enum ServiceErrorType
    {
        NotFound,
        Conflict,
        Validation,
        Unauthorized
    }

    public class ServiceResult<T>
    {
        private ServiceResult(T? value, bool succeeded, ServiceErrorType? errorType, string? errorMessage)
        {
            Value = value;
            Succeeded = succeeded;
            ErrorType = errorType;
            ErrorMessage = errorMessage;
        }

        public T? Value { get; }
        public bool Succeeded { get; }
        public ServiceErrorType? ErrorType { get; }
        public string? ErrorMessage { get; }

        public static ServiceResult<T> Success(T value)
        {
            return new ServiceResult<T>(value, true, null, null);
        }

        public static ServiceResult<T> Failure(ServiceErrorType errorType, string errorMessage)
        {
            return new ServiceResult<T>(default, false, errorType, errorMessage);
        }
    }
}
