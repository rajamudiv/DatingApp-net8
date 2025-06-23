using API.DTOs;
using API.Helpers;

namespace API.Entities
{
    public interface ILikesRepository
    {
        Task<UserLike?> GetUserLike(int sourceUserId, int likedUserId);
        Task<PagedList<MemberDto>> GetUserLikes(LikesParams likesParams);
        Task<IEnumerable<int>> GetCurreentUserLikeIds(int currentUserId);
        void DeleteLike(UserLike userLike);
        void AddLike(UserLike userLike);
        Task<bool> SaveChanges();
    }
}