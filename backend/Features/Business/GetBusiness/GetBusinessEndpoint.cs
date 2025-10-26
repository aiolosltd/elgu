using backend.Common.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessEntity = backend.Common.Models.Business; // Create alias

namespace backend.Features.Business.GetBusiness
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GetBusinessController : ControllerBase
    {
        private readonly GetBusinessService _getBusinessService;

        public GetBusinessController(GetBusinessService getBusinessService)
        {
            _getBusinessService = getBusinessService;
        }

        [HttpGet("{businessId}")]
        public async Task<ActionResult<ApiResponse<BusinessEntity>>> GetBusiness(string businessId)
        {
            var business = await _getBusinessService.GetBusinessById(businessId);

            if (business == null)
                return NotFound(ApiResponse<BusinessEntity>.ErrorResponse("Business not found"));

            return Ok(ApiResponse<BusinessEntity>.SuccessResponse(business));
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<BusinessEntity>>>> GetAllBusinesses()
        {
            var businesses = await _getBusinessService.GetAllBusinesses();
            return Ok(ApiResponse<List<BusinessEntity>>.SuccessResponse(businesses));
        }
    }
}