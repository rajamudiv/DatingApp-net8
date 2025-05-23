using System;

namespace API.Extensions;

public static class DateTimeExtensions
{
    public static int CalculateAge(this DateOnly dateTime)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var age = today.Year - dateTime.Year;

        if (dateTime > today.AddYears(-age)) age--;

        return age;
    }
}
