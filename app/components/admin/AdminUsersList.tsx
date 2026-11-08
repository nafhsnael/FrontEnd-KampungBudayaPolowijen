import UserRowItem, { type AdminUserRowData } from "./UserRowItem";

type AdminUsersListProps<T extends AdminUserRowData> = {
  users: T[];
  isLoading: boolean;
  error: string | null;
  emptyMessage: string;
  onEdit: (user: T) => void;
  onToggleStatus: (userId: T["id"]) => void;
};

export default function AdminUsersList<T extends AdminUserRowData>({
  users,
  isLoading,
  error,
  emptyMessage,
  onEdit,
  onToggleStatus,
}: AdminUsersListProps<T>) {
  return (
    <div className="overflow-x-auto bg-[#FAF3E0]">
      <div className="min-w-[960px]">
        {isLoading ? (
          <p className="px-5 py-10 text-center text-xs text-[#827970]">Memuat data user...</p>
        ) : error ? (
          <p className="px-5 py-10 text-center text-xs text-[#AD5145]" role="alert">{error}</p>
        ) : users.length === 0 ? (
          <p className="px-5 py-10 text-center text-xs text-[#827970]">{emptyMessage}</p>
        ) : (
          users.map((user) => (
            <UserRowItem
              key={user.id}
              user={user}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}
