import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { useMutation } from 'convex/react';
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

function ShareSnippetModal({ onClose }: { onClose: () => void }) {
    const [title, setTitle] = useState("");
    // loading state for when the snippet is being shared
    const [isSharing, setIsSharing] = useState(false);

    const { language, getCode } = useCodeEditorStore();

    // Function to save the snippet to the backend
    const createSnippet = useMutation(api.snippets.createSnippet);

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();

        // in the loading state currently
        setIsSharing(true);

        try {
            // Get the current code from the editor
            const code = getCode();

            // Create a snippet with the code
            await createSnippet({ title, language, code });
            // Close the modal after sharing
            onClose();
            setTitle("");
            toast.success("Snippet shared successfully!");
        } catch (error) {
            console.log("Error sharing snippet:", error);
            toast.error("Error sharing snippet.");
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            {/* Modal Container */}
            <div className="bg-[#1e1e2e] rounded-lg p-6 w-full max-w-md">
                {/* Close Button */}
                <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Share Snippet</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-300 cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                </div>
                {/* Title Input */}
                <form onSubmit={handleShare}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                        Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-[#181825] border border-[#313244] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter snippet title"
                            required
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        {/* Cancel Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                        > Cancel </button>
                        
                        {/* Share Button */}
                        <button
                            type="submit"
                            disabled={isSharing}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                            disabled:opacity-50 cursor-pointer"
                        > {isSharing ? "Sharing..." : "Share"} </button>
                    </div>
                </form>

                
            </div>
        </div>
    )
}

export default ShareSnippetModal