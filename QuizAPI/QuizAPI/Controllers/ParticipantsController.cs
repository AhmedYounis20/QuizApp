﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI;

namespace QuizAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipantsController : ControllerBase
    {
        private readonly QuizDbContext _context;

        public ParticipantsController(QuizDbContext context)
        {
            _context = context;
        }

        // GET: api/Participants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Participant>>> GetParticipants()
        {
          if (_context.Participants == null)
          {
              return NotFound();
          }
            return await _context.Participants.ToListAsync();
        }

        // GET: api/Participants/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Participant>> GetParticipant(int id)
        {
          if (_context.Participants == null)
          {
              return NotFound();
          }
            var participant = await _context.Participants.FindAsync(id);

            if (participant == null)
            {
                return NotFound();
            }

            return participant;
        }

        // PUT: api/Participants/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutParticipant(int id, Participant participant)
        {
            if (id != participant.ParticipantId)
            {
                return BadRequest();
            }

            _context.Entry(participant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParticipantExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Participants
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Participant>> PostParticipant(Participant participant)
        {
            Participant? tempParticipant= _context.Participants.Where(x=>x.Name==participant.Name && x.Email==participant.Email).FirstOrDefault();
          if (tempParticipant == null)
          {
            _context.Participants.Add(participant);
            await _context.SaveChangesAsync();
          }
            participant = tempParticipant ?? new();

            return Ok(participant);
        }
        [HttpPost("SaveScore")]
        public async Task<ActionResult<Participant>> SaveScore(ParticipantResult participantResult)
        {   
            Participant? participant = _context.Participants.Where(x => x.ParticipantId == participantResult.ParticipantId).FirstOrDefault();
            if (participant == null)
            {
                return Ok("there is an error");
            }
            participant.TimeTaken = participantResult.TimeTaken;
            participant.Score = participantResult.Score;
            _context.Participants.Update(participant);
            await _context.SaveChangesAsync();

            return Ok(participant);
        }

        // DELETE: api/Participants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParticipant(int id)
        {
            if (_context.Participants == null)
            {
                return NotFound();
            }
            var participant = await _context.Participants.FindAsync(id);
            if (participant == null)
            {
                return NotFound();
            }

            _context.Participants.Remove(participant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ParticipantExists(int id)
        {
            return (_context.Participants?.Any(e => e.ParticipantId == id)).GetValueOrDefault();
        }
    }
}
