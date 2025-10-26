namespace backend.Common.Models
{
    public class BusinessRequirementInfo
    {
        public int Id { get; set; }
        public string BusinessId { get; set; } = string.Empty;
        public string? DtiNo { get; set; }
        public DateTime? DtiIssued { get; set; }
        public DateTime? DtiExpiry { get; set; }
        public string? SecNo { get; set; }
        public DateTime? SecIssued { get; set; }
        public DateTime? SecExpiry { get; set; }
        public string? CdaNo { get; set; }
        public DateTime? CdaIssued { get; set; }
        public DateTime? CdaExpiry { get; set; }
        public string? LocalClearanceNo { get; set; }
        public DateTime? LocalClearanceDate { get; set; }
        public string? CedulaNo { get; set; }
        public string? CedulaPlaceIssued { get; set; }
        public DateTime? CedulaIssued { get; set; }
        public double? CedulaAmount { get; set; }
        public string? BoiNo { get; set; }
        public DateTime? BoiIssued { get; set; }
        public DateTime? BoiExpiry { get; set; }
        public string? SssNo { get; set; }
        public DateTime? SssDateReg { get; set; }
        public string? PagIbigNo { get; set; }
        public DateTime? PagIbigReg { get; set; }
        public string? PhicNo { get; set; }
        public DateTime? PhicReg { get; set; }
        public bool PezaRegistered { get; set; } = false;
        public string? PezaRegNo { get; set; }
        public DateTime? PezaIssued { get; set; }
        public DateTime? PezaExpiry { get; set; }
    }
}
