using System;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using API.Entities;
using API.Interfaces;
using System.IdentityModel.Tokens.Jwt;

namespace API.Services;

public class TokenService(IConfiguration config) : ITokenService
{
    public string CreateToken(AppUser user)
    {
        var tokenKey = config["TokenKey"] ?? throw new Exception("cant access tokenkey from appSettings");
        if (tokenKey.Length < 64)
        {
            throw new Exception("Token key is too short");
        }
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserName)
        };
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = creds
        };

        var tokemhandler = new JwtSecurityTokenHandler();
        var token = tokemhandler.CreateToken(tokenDescriptor);

        return tokemhandler.WriteToken(token);
    }
}