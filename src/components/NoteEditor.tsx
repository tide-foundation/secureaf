import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { vaultDB, VaultItem } from '@/lib/db';
import { useTideCloak } from '@tidecloak/react';
import { X, Save, Lock } from 'lucide-react';

interface NoteEditorProps {
  editingItem?: VaultItem | null;
  onClose: () => void;
  onSave: () => void;
}

export function NoteEditor({ editingItem, onClose, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const { doEncrypt } = useTideCloak();
  const { toast } = useToast();

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      if (editingItem.isDecrypted && editingItem.decryptedData) {
        setContent(typeof editingItem.decryptedData === 'string' ? editingItem.decryptedData : '');
      }
    }
  }, [editingItem]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide both title and content",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    try {
      // Encrypt the content
      const encrypted = await doEncrypt([{ data: content, tags: ['note'] }]);
      
      const now = Date.now();
      const item: VaultItem = {
        id: editingItem?.id || `note_${now}`,
        type: 'note',
        title: title.trim(),
        encryptedData: encrypted[0],
        tags: ['note'],
        createdAt: editingItem?.createdAt || now,
        updatedAt: now,
      };

      if (editingItem) {
        await vaultDB.updateItem(item);
        toast({
          title: "Note Updated",
          description: "Your note has been updated and encrypted",
        });
      } else {
        await vaultDB.addItem(item);
        toast({
          title: "Note Saved",
          description: "Your note has been encrypted and stored securely",
        });
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save your note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-card/95 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              {editingItem ? 'Edit Note' : 'New Note'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="bg-background/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note content here..."
                className="min-h-[300px] bg-background/50 resize-none"
              />
            </div>

            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
              <p className="text-sm text-primary flex items-center gap-2">
                <Lock className="w-4 h-4" />
                This note will be encrypted before storing locally
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Encrypting...' : editingItem ? 'Update Note' : 'Save Note'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}