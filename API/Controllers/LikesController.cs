using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController : BaseApiController
{
    private readonly ILikesRepository likesRepository;
    public LikesController(ILikesRepository _likesRepository)
    {
        likesRepository = _likesRepository;
    }

    [HttpPost("{targetUserId:int}")]
    public async Task<ActionResult> ToggleLike(int targetUserId)
    {
        var sourceUserId = User.GetUserId();
        if (sourceUserId == targetUserId)
        {
            return BadRequest("You cannot like yourself");
        }

        var userLike = await likesRepository.GetUserLike(sourceUserId, targetUserId);

        if (userLike != null)
        {
            likesRepository.DeleteLike(userLike);
        }
        else
        {
            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUserId
            };
            likesRepository.AddLike(userLike);
        }

        if (await likesRepository.SaveChanges())
        {
            return Ok();
        }

        return BadRequest("Failed to toggle like");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikeIds()
    {
        var currentUserId = User.GetUserId();
        var likeIds = await likesRepository.GetCurreentUserLikeIds(currentUserId);

        return Ok(likeIds);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
    {
        likesParams.UserId = User.GetUserId();
        var users = await likesRepository.GetUserLikes(likesParams);
        Response.AddPaginationHeader(users);
        return Ok(users);
    }
}
