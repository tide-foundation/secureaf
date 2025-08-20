import { useState, useEffect } from 'react';
import { Plus, FileText, Image, Eye, EyeOff, Trash2, Edit, Lock, Unlock, LogOut, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { vaultDB, VaultItem } from '@/lib/db';
import { useTideCloak } from '@tidecloak/react';
import { NoteEditor } from '@/components/NoteEditor';
import { FileUploader } from '@/components/FileUploader';

export default function Vault() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { doDecrypt, doEncrypt, logout } = useTideCloak();
  const { toast } = useToast();

  useEffect(() => {
    initDB();
  }, []);

  const initDB = async () => {
    try {
      await vaultDB.init();
      await loadItems();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      toast({
        title: "Database Error",
        description: "Failed to initialize local database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    try {
      const allItems = await vaultDB.getAllItems();
      setItems(allItems.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error('Failed to load items:', error);
      toast({
        title: "Load Error",
        description: "Failed to load vault items",
        variant: "destructive",
      });
    }
  };

  const handleDecrypt = async (item: VaultItem) => {
    try {
      let decrypted;
      
      if (item.type === 'file') {
        // For files, decrypt both file data and metadata
        const decryptedFile = await doDecrypt([
          { encrypted: item.encryptedData.fileData, tags: ['file'] },
          { encrypted: item.encryptedData.metadata, tags: ['file_metadata'] }
        ]);
        
        decrypted = {
          fileData: decryptedFile[0],
          metadata: JSON.parse(decryptedFile[1])
        };
      } else {
        // For notes, decrypt the string data
        const decryptedNote = await doDecrypt([{ encrypted: item.encryptedData, tags: ['note'] }]);
        decrypted = decryptedNote[0];
      }
      
      const updatedItem = {
        ...item,
        isDecrypted: true,
        decryptedData: decrypted
      };
      
      setItems(items.map(i => i.id === item.id ? updatedItem : i));
      
      toast({
        title: "Decrypted",
        description: "Content has been decrypted successfully",
      });
    } catch (error) {
      console.error('Decryption failed:', error);
      toast({
        title: "Decryption Failed",
        description: "Unable to decrypt this item",
        variant: "destructive",
      });
    }
  };

  const handleEncrypt = async (item: VaultItem) => {
    const updatedItem = {
      ...item,
      isDecrypted: false,
      decryptedData: undefined
    };
    
    setItems(items.map(i => i.id === item.id ? updatedItem : i));
    
    toast({
      title: "Encrypted",
      description: "Content has been encrypted",
    });
  };

  const handleDelete = async (item: VaultItem) => {
    try {
      await vaultDB.deleteItem(item.id);
      setItems(items.filter(i => i.id !== item.id));
      
      toast({
        title: "Deleted",
        description: "Item has been deleted from your vault",
      });
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: "Delete Failed",
        description: "Unable to delete this item",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: VaultItem) => {
    setEditingItem(item);
    if (item.type === 'note') {
      setShowNoteEditor(true);
    }
  };

  const handleDownload = (item: VaultItem) => {
    if (!item.isDecrypted || !item.decryptedData || item.type !== 'file')
      return toast({ title: "Download Failed", description: "File must be decrypted first", variant: "destructive" });
  
    const { fileData, metadata } = item.decryptedData;
  
    const toBlob = (data: any, type: string) => {
      if (data instanceof Uint8Array) return new Blob([data], { type });
      if (data instanceof ArrayBuffer) return new Blob([new Uint8Array(data)], { type });
      if (typeof data === "string") {
        if (data.startsWith("data:")) return fetch(data).then(r => r.blob());
        if (/^\d+(,\d+)+$/.test(data)) return new Blob([Uint8Array.from(data.split(",").map(Number))], { type });
        const bin = atob(data.replace(/^data:[^;]+;base64,/, "").replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/"));
        return new Blob([Uint8Array.from(bin, c => c.charCodeAt(0))], { type });
      }
      throw new Error("Unsupported fileData type");
    };
  
    Promise.resolve(toBlob(fileData, metadata.type))
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), { href: url, download: metadata.name });
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
        toast({ title: "Downloaded", description: `${metadata.name} has been downloaded` });
      })
      .catch(err => {
        console.error("Download failed:", err);
        toast({ title: "Download Failed", description: "Unable to download file", variant: "destructive" });
      });
  };


  const isImageFile = (metadata: any) => {
    return metadata?.type?.startsWith('image/');
  };

  const getImagePreview = (fileData: string | Uint8Array, metadata: any) => {
    if (!isImageFile(metadata)) return null;
  
    // Helper to convert Uint8Array to base64
    const uint8ArrayToBase64 = (bytes: Uint8Array) => {
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    };
  
    let base64Data: string;
  
    if (fileData instanceof Uint8Array) {
      base64Data = uint8ArrayToBase64(fileData);
    } else if (typeof fileData === 'string') {
      // Trim just in case and ensure no accidental breaks/spaces
      base64Data = fileData.replace(/\s+/g, '');
    } else {
      return null;
    }
  
    return `data:${metadata.type};base64,${base64Data}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-6 py-8">
        <header className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <Button onClick={logout} variant="neonBlue" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
          <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/ca0765a4-841c-4280-a13a-395e55fa67ed.png" 
            alt="Secure AF - Neon logo with padlock and sunglasses" 
            className="h-48 w-auto"
          />
        </div>
        <h2 className="text-3xl font-bold mb-8 text-center">
              Vibe <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Coded.</span> Provably <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Secure.</span>
            </h2>
        </header>   

        <div className="flex justify-center gap-4 mb-8">
          <Button 
            onClick={() => setShowNoteEditor(true)}
            variant="neon"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
          <Button 
            onClick={() => setShowFileUploader(true)}
            variant="neonBlue"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Lock className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your vault is empty</h3>
            <p className="text-muted-foreground mb-6">Add your first note or file to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 max-w-4xl mx-auto">
            {items.map((item) => (
              <Card key={item.id} className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {item.type === 'note' ? (
                        <FileText className="w-5 h-5 text-primary" />
                      ) : (
                        <Image className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formatDate(item.createdAt)}
                      </p>
                      
                      {item.isDecrypted && item.decryptedData ? (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          {item.type === 'note' ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {typeof item.decryptedData === 'string' 
                                ? item.decryptedData 
                                : 'Content available'}
                            </p>
                          ) : (
                            <div>
                              {(() => {
                                const { fileData, metadata } = item.decryptedData as { fileData: string; metadata: any };
                                const imagePreview = getImagePreview(fileData, metadata);
                                
                                if (imagePreview) {
                                  return (
                                    <div className="space-y-2">
                                      <img 
                                        src={imagePreview} 
                                        alt="Decrypted preview" 
                                        className="max-w-full max-h-64 rounded-lg border"
                                      />
                                       <p className="text-sm text-neon-pink flex items-center gap-2">
                                         <Check className="w-4 h-4" />
                                         Image preview available
                                       </p>
                                    </div>
                                  );
                                } else {
                                   return <p className="text-sm text-neon-pink flex items-center gap-2">
                                     <Check className="w-4 h-4" />
                                     Ready to download
                                   </p>;
                                }
                              })()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-3 p-3 bg-neon-blue/10 rounded-lg border border-neon-blue/20">
                          <p className="text-sm text-neon-blue flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Content is encrypted
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {item.isDecrypted ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEncrypt(item)}
                        className="border-neon-purple text-neon-purple hover:bg-neon-purple/10 hover:text-neon-purple"
                      >
                        <EyeOff className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecrypt(item)}
                        className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:text-neon-cyan"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {item.type === 'note' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="border-neon-pink text-neon-pink hover:bg-neon-pink/10 hover:text-neon-pink"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {item.type === 'file' && item.isDecrypted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(item)}
                        className="border-neon-blue text-neon-blue hover:bg-neon-blue/10 hover:text-neon-blue"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item)}
                      className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {showNoteEditor && (
          <NoteEditor
            editingItem={editingItem}
            onClose={() => {
              setShowNoteEditor(false);
              setEditingItem(null);
            }}
            onSave={loadItems}
          />
        )}

        {showFileUploader && (
          <FileUploader
            onClose={() => setShowFileUploader(false)}
            onSave={loadItems}
          />
        )}
      </div>
    </div>
  );
}