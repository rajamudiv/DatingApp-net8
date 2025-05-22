using System;

namespace API.Errors;

public class ApiException(int statusCode, string message, string details) : Exception(message)
{
    public int StatusCode { get; set; } = statusCode;
    public string Details { get; set; } = details;
    public string Message { get; set; } = message;
}
