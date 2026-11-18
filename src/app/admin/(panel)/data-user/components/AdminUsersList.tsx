import UserRowItem, { type AdminUserRowData } from "./UserRowItem";

type AdminUsersListProps<T extends AdminUserRowData> = {
  users: T[];
  displayNumberOffset?: number;
  isLoading: boolean;
  error: string | null;
  emptyMessage: string;
  onEdit: (user: T) => void;
  onToggleStatus: (userId: T["id"]) => void;
  onDelete: (user: T) => void;
};

export default function AdminUsersList<T extends AdminUserRowData>({
  users,
  displayNumberOffset = 0,
  isLoading,
  error,
  emptyMessage,
  onEdit,
  onToggleStatus,
  onDelete,
}: AdminUsersListProps<T>) {
  return (
    <div className="bg-white">
      <div className="min-w-[690px]">
        {isLoading ? (
          <p className="px-5 py-10 text-center text-[10px] text-[#827970]">Memuat data user...</p>
        ) : error ? (
          <p className="px-5 py-10 text-center text-[10px] text-[#AD5145]" role="alert">{error}</p>
        ) : users.length === 0 ? (
          <p className="px-5 py-10 text-center text-[10px] text-[#827970]">{emptyMessage}</p>
        ) : (
          users.map((user, index) => (
            <UserRowItem
              key={user.id}
              user={user}
              displayNumber={displayNumberOffset + index + 1}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
