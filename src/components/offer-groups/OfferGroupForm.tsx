import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OfferGroup {
  idgroup: string;
  descgroup: string;
  grouptype: string;
}

interface OfferGroupFormProps {
  editingGroup: OfferGroup | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function OfferGroupForm({ editingGroup, onSubmit }: OfferGroupFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="idgroup">Group ID</Label>
        <Input
          id="idgroup"
          name="idgroup"
          defaultValue={editingGroup?.idgroup}
          required
        />
      </div>
      <div>
        <Label htmlFor="descgroup">Description</Label>
        <Input
          id="descgroup"
          name="descgroup"
          defaultValue={editingGroup?.descgroup}
          required
        />
      </div>
      <div>
        <Label htmlFor="grouptype">Group Type</Label>
        <Input
          id="grouptype"
          name="grouptype"
          defaultValue={editingGroup?.grouptype}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        {editingGroup ? "Update" : "Create"}
      </Button>
    </form>
  );
}