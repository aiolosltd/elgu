namespace backend.Common.Models
{

    public class Business
    {
        public int Id { get; set; }
        public string BusinessId { get; set; } = string.Empty;
        public bool IsMain { get; set; } = true;
        public bool IsForeign { get; set; } = false;
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
        public bool Status { get; set; } = true;
        public DateTime DateTimestamp { get; set; } = DateTime.Now;

        // Navigation properties
        public BusinessAddress? Address { get; set; }
        public BusinessRepresentative? Representative { get; set; }
        public BusinessRequirementInfo? Requirements { get; set; }
    }
}
