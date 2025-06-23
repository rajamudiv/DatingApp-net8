namespace API.Helpers;

public class LikesParams : PaginationParams
{
    public int UserId { get; set; }
    public required string Predicate { get; set; } = "liked"; // liked or likedBy
    public string? CurrentUsername { get; set; }
    
    // Additional properties can be added here if needed in the future
}