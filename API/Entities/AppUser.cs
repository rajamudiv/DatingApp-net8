using System;
using Microsoft.Build.Framework;
using API.Extensions;

namespace API.Entities;

public class AppUser
{
    public int Id { get; set; }
    public required string UserName { get; set; }
    public byte[] PasswordHash { get; set; } = [];
    public byte[] PasswordSalt { get; set; } = [];
    public DateOnly DateOfBirth { get; set; }
    public string KnownAs { get; set; } = string.Empty;
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public required string Gender { get; set; }
    public string Introduction { get; set; } = string.Empty;
    public string Interests { get; set; } = string.Empty;
    public string LookingFor { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public List<Photo> Photos { get; set; } = [];
    public List<UserLike> LikedByUsers { get; set; } = [];
    public List<UserLike> LikedUsers { get; set; } = [];
}
