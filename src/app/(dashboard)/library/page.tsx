"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { SearchBar } from "@/components/ui/search-bar";

export default function LibraryPage() {
  const [currentFolder, setCurrentFolder] = useState<string>("Root");
  const [folders, setFolders] = useState([
    { id: "1", name: "Lectures & Slides", parent: "Root" },
    { id: "2", name: "Assignments & Projects", parent: "Root" },
    { id: "3", name: "Resumes & Portfolios", parent: "Root" },
    { id: "4", name: "Database Normalization", parent: "1" },
    { id: "5", name: "React Advanced", parent: "1" },
  ]);

  const [files, setFiles] = useState([
    { id: "1", name: "Prisma_Models_Documentation.pdf", folderId: "4", size: "1.2 MB", tag: "Database" },
    { id: "2", name: "Relational_Calculus_CheatSheet.md", folderId: "4", size: "142 KB", tag: "Database" },
    { id: "3", name: "React_Advanced_Hooks_Lecture.docx", folderId: "5", size: "324 KB", tag: "Frontend" },
    { id: "4", name: "Technical_Resume_JohnDoe.pdf", folderId: "3", size: "842 KB", tag: "Career" },
    { id: "5", name: "Project_Syllabus_2026.pdf", folderId: "2", size: "2.1 MB", tag: "Syllabus" },
  ]);

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      const newFolder = {
        id: String(folders.length + 1),
        name: newFolderName,
        parent: currentFolder === "Root" ? "Root" : folders.find(f => f.name === currentFolder)?.id || "Root",
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setIsFolderModalOpen(false);
    }
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const activeFolderId = currentFolder === "Root" ? "Root" : folders.find((f) => f.name === currentFolder)?.id;

  const filteredFolders = folders.filter(
    (f) =>
      f.parent === (currentFolder === "Root" ? "Root" : activeFolderId) &&
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = files.filter(
    (f) =>
      (currentFolder === "Root" ? true : f.folderId === activeFolderId) &&
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Learning Library</h1>
          <p className="text-xs text-zinc-505">Organize note slides, books, code ZIPs, and PDF files.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="secondary" size="sm" onClick={() => setIsFolderModalOpen(true)} className="cursor-pointer flex-1 sm:flex-initial">
            📁 New Folder
          </Button>
          <Button size="sm" className="flex-1 sm:flex-initial cursor-pointer" onClick={() => {
            const mockFileName = `Lecture_Note_${Math.floor(Math.random() * 100)}.pdf`;
            const newFile = {
              id: String(files.length + 1),
              name: mockFileName,
              folderId: currentFolder === "Root" ? "2" : activeFolderId || "Root",
              size: "450 KB",
              tag: "General",
            };
            setFiles([...files, newFile]);
          }}>
            📤 Upload File
          </Button>
        </div>
      </div>

      {/* Breadcrumbs / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass-effect p-4 rounded-2xl bg-card-bg">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setCurrentFolder("Root")}
            className="text-brand-primary hover:underline cursor-pointer"
          >
            Library
          </button>
          {currentFolder !== "Root" && (
            <>
              <span className="text-zinc-400">/</span>
              <span className="text-zinc-550">{currentFolder}</span>
            </>
          )}
        </div>
        <div className="w-full sm:w-64">
          <SearchBar
            placeholder="Search directory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Folders List */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Folders</h2>
          <div className="flex flex-col gap-2">
            {filteredFolders.length === 0 ? (
              <p className="text-xs text-zinc-450 italic">No subfolders.</p>
            ) : (
              filteredFolders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setCurrentFolder(folder.name)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border border-card-border glass-effect bg-white hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-left w-full cursor-pointer transition-colors"
                >
                  <span>📁</span>
                  <span className="truncate">{folder.name}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Files Table */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-0">Files</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto mt-4">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-10 flex flex-col items-center justify-center gap-2">
                <span className="text-3xl">📂</span>
                <p className="text-xs font-semibold text-zinc-450">This folder is empty.</p>
                <p className="text-[10px] text-zinc-450">Drag files here or click Upload File to add items.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-card-border text-[10px] font-bold text-zinc-400 uppercase">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Tag</th>
                    <th className="pb-3">Size</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border text-xs">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="py-3.5 font-semibold flex items-center gap-2">
                        <span>📄</span>
                        <span className="truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold">
                          {file.tag}
                        </span>
                      </td>
                      <td className="py-3.5 text-zinc-550">{file.size}</td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-1 rounded-lg text-zinc-400 hover:text-brand-accent hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Folder Creation Modal */}
      <Modal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        title="Create New Folder"
      >
        <form onSubmit={handleCreateFolder} className="flex flex-col gap-4">
          <Input
            label="Folder Name"
            placeholder="e.g. Operating Systems"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" size="sm" type="button" onClick={() => setIsFolderModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Create Folder
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
