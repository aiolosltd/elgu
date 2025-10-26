namespace backend.Common.Models
{
    public class CbOption
    {
        public int Id { get; set; }
        public string CbType { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public DateTime DateTimestamp { get; set; } = DateTime.Now;
        public string UserId { get; set; } = string.Empty;
        public bool Status { get; set; } = true;
    }
}
