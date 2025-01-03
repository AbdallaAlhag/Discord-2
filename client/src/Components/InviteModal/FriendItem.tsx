import defaultAvatar from "/public/default-avatar.svg";

interface FriendItemProps {
  name: string;
  avatarUrl: string | null;
  onInvite: () => void;
}

export function FriendItem({ name, avatarUrl, onInvite }: FriendItemProps) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-[#404249] rounded">
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl || defaultAvatar}
          alt={name}
          className="w-8 h-8 rounded-full"
        />
        <span className="font-medium">{name}</span>
      </div>
      <button
        onClick={onInvite}
        className="px-4 py-1 bg-[#2d7d46] hover:bg-[#215b33] rounded text-sm font-semibold"
      >
        Invite
      </button>
    </div>
  );
}
