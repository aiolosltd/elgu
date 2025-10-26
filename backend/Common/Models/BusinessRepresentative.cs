namespace backend.Common.Models
{
    public class BusinessRepresentative
    {
        public int Id { get; set; }
        public string RepId { get; set; } = string.Empty;
        public string RepName { get; set; } = string.Empty;
        public string RepPosition { get; set; } = string.Empty;
        public string OwnershipType { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = string.Empty;
        public string? SuffixName { get; set; }
        public DateTime BirthDate { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string CivilStatus { get; set; } = string.Empty;
        public string Nationality { get; set; } = string.Empty;
        public string? TelNo { get; set; }
        public string? CellNo { get; set; }
        public string? FaxNo { get; set; }
        public string? Email { get; set; }
        public string? Tin { get; set; }
        public bool OutsideCity { get; set; } = false;
        public string Province { get; set; } = string.Empty;
        public string Municipality { get; set; } = string.Empty;
        public string? Barangay { get; set; }
        public string? Subdivision { get; set; }
        public string? Street { get; set; }
        public string? BuildingName { get; set; }
        public string? HouseNo { get; set; }
        public string? Block { get; set; }
        public string? Lot { get; set; }
        public string Landmark { get; set; } = string.Empty;
        public bool Status { get; set; } = true;
    }
}
