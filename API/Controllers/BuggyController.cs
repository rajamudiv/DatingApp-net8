using System;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController(DataContext context) : BaseApiController
{
    [HttpGet("auth")]
    public ActionResult<string> GetAuth()
    {
        return "secret stuff";
    }

    [HttpGet("not-found")]
    public ActionResult<AppUser> GetNotFound()
    {
        var thing = context.Users.Find(-1);

        if (thing == null) return NotFound();

        return Ok(thing);
    }

    [HttpGet("server-error")]
    public ActionResult<string> GetServerError()
    {
        var thing = context.Users.Find(-1);

        var thingToReturn = thing.ToString();

        return thingToReturn;
    }

    [HttpGet("bad-request")]
    public ActionResult<string> GetBadRequest()
    {
        return BadRequest("this was not a good request");
    }
}
