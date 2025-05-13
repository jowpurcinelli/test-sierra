"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkItem, LinkItemType } from "@/components/link-item"
import { AddLinkDialog } from "@/components/add-link-dialog"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useLinks } from "@/hooks/use-links"
import { Link as LinkType, CreateLinkDto, UpdateLinkDto } from "@/types/api"
import { DragDropContext, Droppable, Draggable } from "@/components/drag-drop"
import { Skeleton } from "@/components/ui/skeleton"
import { type DropResult } from "react-beautiful-dnd"

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const { toast } = useToast()
  
  
  const { 
    getLinks, 
    createLink, 
    updateLink, 
    deleteLink, 
    updateLinkOrder 
  } = useLinks()
  
  
  const { 
    data: links = [], 
    isLoading, 
    isError 
  } = getLinks

  const handleAddLink = async (newLink: { 
    title: string; 
    url: string; 
    description?: string; 
    isActive?: boolean;
  }) => {
    try {
      const linkDto: CreateLinkDto = {
        title: newLink.title,
        url: newLink.url,
        description: newLink.description,
        isActive: newLink.isActive ?? true,
        order: links.length,
      }
      
      await createLink.mutateAsync(linkDto)
      
      toast({
        title: "Link added",
        description: "Your link has been added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add link",
        variant: "destructive",
      })
    }
  }

  const handleUpdateLink = async (updatedLink: LinkItemType) => {
    try {
      const { id, ...data } = updatedLink
      
      
      const updateDto: UpdateLinkDto = {
        title: data.title,
        url: data.url,
        description: data.description || undefined, 
        isActive: data.isActive,
        order: data.order,
      }
      
      await updateLink.mutateAsync({ id, data: updateDto })
      
      toast({
        title: "Link updated",
        description: "Your link has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update link",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLink = async (id: string) => {
    try {
      await deleteLink.mutateAsync(id)
      
      toast({
        title: "Link deleted",
        description: "Your link has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      })
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    
    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      return
    }

    const items = Array.from(links)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }))

    try {
      const reorderPayload = {
        links: updatedItems.map((item) => ({ 
          id: item.id, 
          order: item.order 
        }))
      }
      
      await updateLinkOrder.mutateAsync(reorderPayload)
      
      toast({
        title: "Links reordered",
        description: "Your links have been reordered successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save link order",
        variant: "destructive",
      })
    }
  }

  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Links</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Manage Your Links</CardTitle>
            <CardDescription>
              Add, edit, delete, and reorder your links. Drag and drop to change the order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-60" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Failed to load links</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          There was an error loading your links. Please try refreshing the page.
        </p>
      </div>
    )
  }

  
  const linkItems: LinkItemType[] = links
    .map(link => ({
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description,
      isActive: link.isActive,
      order: link.order,
    }))
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Links</h1>
        <AddLinkDialog onAddLink={handleAddLink} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Links</CardTitle>
          <CardDescription>
            Add, edit, delete, and reorder your links. Drag and drop to change the order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {linkItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <h3 className="mb-2 text-lg font-semibold">No links yet</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Add your first link to get started with your LinkHub page.
              </p>
              <AddLinkDialog onAddLink={handleAddLink}>
                <Button>Add Your First Link</Button>
              </AddLinkDialog>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                    className="space-y-2"
                  >
                    {linkItems.map((link, index) => (
                      <Draggable key={link.id} draggableId={link.id} index={index}>
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef} 
                            {...provided.draggableProps}
                            className={snapshot.isDragging ? "opacity-75 ring-2 ring-primary rounded-lg" : ""}
                          >
                            <LinkItem 
                              link={link} 
                              onUpdate={handleUpdateLink} 
                              onDelete={handleDeleteLink} 
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
