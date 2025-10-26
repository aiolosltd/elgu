namespace backend.Features.Business.CreateBusiness;

public class CreateBusinessResponse
{
    public string BusinessId { get; set; } = string.Empty;
    public string BusinessName { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}