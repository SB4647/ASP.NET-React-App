using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{

    public class ActivitiesController : BaseApiController
    {

        //Get all activities
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await Mediator.Send(new List.Query());
        }

        //Get an activity based on id 
        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActvity(Guid id)
        {
            return await Mediator.Send(new Details.Query{ Id = id });
        }

        //Create an activity sent in body
        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return Ok(await Mediator.Send(new Create.Command { Activity = activity }));
        }

    }
}
