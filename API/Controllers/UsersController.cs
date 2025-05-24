using System;
using System.Collections;
using System.Security.Claims;
using API.Data;
using API.Data.Migrations;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UsersController(IUserRepository userRepository, IMapper mapper)
    {
        _mapper = mapper;
        _userRepository = userRepository;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        var users = await _userRepository.GetMembersAsync();

        return Ok(users);
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        var user = await _userRepository.GetMemberAsync(username);

        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }    
    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (username == null)
        {
            return Unauthorized();
        }
        var user = await _userRepository.GetUserByUsernameAsync(username);
        if (user == null)
        {
            return NotFound();
        }
        
        _mapper.Map(memberUpdateDto, user);

        if (await _userRepository.SaveAllAsync())
        {
            return NoContent();
        }

        return BadRequest("Failed to update user");
    }
}
