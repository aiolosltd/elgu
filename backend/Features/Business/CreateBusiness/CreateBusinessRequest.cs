namespace backend.Features.Business.CreateBusiness;

public class CreateBusinessRequest
{
    public string BusinessName { get; set; } = string.Empty;
    public DateTime DateEstablished { get; set; }
    public string OwnershipType { get; set; } = string.Empty;
    public string RegisteredCEO { get; set; } = string.Empty;
    public string? TradeName { get; set; }
    public bool IsFranchise { get; set; } = false;
    public bool IsMarketStall { get; set; } = false;
    public bool IsCommercialBuilding { get; set; } = false;
    public string? MarketStall { get; set; }
    public string? BusinessBuildingId { get; set; }
    public string BuildingSpace { get; set; } = string.Empty;
    public bool WaiverAgreement { get; set; } = true;

    // Address information
    public string Province { get; set; } = string.Empty;
    public string Municipality { get; set; } = string.Empty;
    public string Barangay { get; set; } = string.Empty;
    public string? Subdivision { get; set; }
    public string? Street { get; set; }
    public string? BuildingName { get; set; }
    public string? HouseNo { get; set; }
    public string? PhaseBlock { get; set; }
    public string? Lot { get; set; }
    public string Landmark { get; set; } = string.Empty;
    public string LongLat { get; set; } = string.Empty;
    public string? TelNo { get; set; }
    public string? CellNo { get; set; }
    public string? FaxNo { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Tin { get; set; }
}