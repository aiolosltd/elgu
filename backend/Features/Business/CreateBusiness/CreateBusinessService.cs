using backend.Common.Models;
using backend.Data;
using BusinessEntity = backend.Common.Models.Business;

namespace backend.Features.Business.CreateBusiness
{
    public class CreateBusinessService
    {
        private readonly DatabaseContext _context;

        public CreateBusinessService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<CreateBusinessResponse> CreateBusiness(CreateBusinessRequest request, string userId)
        {
            var businessId = GenerateBusinessId();

            // Create business main info
            var business = new BusinessEntity
            //var business = new global::backend.Common.Models.Business
            {
                BusinessId = businessId,
                BusinessName = request.BusinessName,
                DateEstablished = request.DateEstablished,
                OwnershipType = request.OwnershipType,
                RegisteredCEO = request.RegisteredCEO,
                TradeName = request.TradeName,
                IsFranchise = request.IsFranchise,
                IsMarketStall = request.IsMarketStall,
                IsCommercialBuilding = request.IsCommercialBuilding,
                MarketStall = request.MarketStall,
                BusinessBuildingId = request.BusinessBuildingId,
                BuildingSpace = request.BuildingSpace,
                WaiverAgreement = request.WaiverAgreement,
                Status = true,
                DateTimestamp = DateTime.Now
            };

            // Create business address
            var address = new BusinessAddress
            {
                BusinessId = businessId,
                Province = request.Province,
                Municipality = request.Municipality,
                Barangay = request.Barangay,
                Subdivision = request.Subdivision,
                Street = request.Street,
                BuildingName = request.BuildingName,
                HouseNo = request.HouseNo,
                PhaseBlock = request.PhaseBlock,
                Lot = request.Lot,
                Landmark = request.Landmark,
                LongLat = request.LongLat,
                TelNo = request.TelNo,
                CellNo = request.CellNo,
                FaxNo = request.FaxNo,
                Email = request.Email,
                Tin = request.Tin,
                Status = true,
                DateTimestamp = DateTime.Now
            };

            _context.Businesses.Add(business);
            _context.BusinessAddresses.Add(address);
            await _context.SaveChangesAsync();

            return new CreateBusinessResponse
            {
                BusinessId = businessId,
                BusinessName = request.BusinessName,
                CreatedDate = DateTime.Now
            };
        }

        private string GenerateBusinessId()
        {
            return $"BUS_{DateTime.Now:yyyyMMddHHmmss}_{new Random().Next(1000, 9999)}";
        }
    }
}