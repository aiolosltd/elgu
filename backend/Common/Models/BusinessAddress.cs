namespace backend.Common.Models
{
    public class BusinessAddress
    {
        public int Id { get; set; }
        public string BusinessId { get; set; } = string.Empty;
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
        public bool Status { get; set; } = true;
        public DateTime DateTimestamp { get; set; } = DateTime.Now;
    }
}
