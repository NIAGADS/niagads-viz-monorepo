"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Info,
  TrendingUp,
  ExternalLink,
  Brain,
  GitBranch,
  Database,
  BarChart2,
  Dna,
  Activity,
  Download,
  Eye,
  Users,
  Settings,
} from "lucide-react"
import "./record-sidebar.css"

interface RecordSidebarProps {
  type: string
  record: any
  activeSection: string
  setActiveSection: (section: string) => void
  isOpen: boolean
  onToggle: () => void
}

interface SidebarItem {
  id: string
  label: string
  icon: any
  children?: SidebarItem[]
}

export function RecordSidebar({ type, record, activeSection, setActiveSection, isOpen, onToggle }: RecordSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["trait-associations"]))
  const router = useRouter()

  // Define sidebar items - only Trait associations has children for genes
  const getSidebarItems = (): SidebarItem[] => {
    if (!record) return []

    switch (type) {
      case "gene":
        return [
          { id: "overview", label: "Overview", icon: Info },
          {
            id: "trait-associations",
            label: "Trait associations",
            icon: TrendingUp,
            children: [
              { id: "niagads-gwas", label: "NIAGADS GWAS", icon: Database },
              { id: "gwas-catalog", label: "GWAS Catalog", icon: Database },
            ],
          },
          { id: "link-outs", label: "Link outs", icon: ExternalLink },
          { id: "function-prediction", label: "Function prediction", icon: Brain },
          { id: "pathways-interactions", label: "Pathways and interactions", icon: GitBranch },
        ]
      case "variant":
        return [
          { id: "overview", label: "Overview", icon: Info },
          { id: "population", label: "Population Frequencies", icon: BarChart2 },
          { id: "functional", label: "Functional Impact", icon: Database },
          { id: "associations", label: "Disease Associations", icon: TrendingUp },
          { id: "linkage", label: "Linkage Disequilibrium", icon: GitBranch },
        ]
      case "span":
        return [
          { id: "overview", label: "Overview", icon: Info },
          { id: "features", label: "Genomic Features", icon: Database },
          { id: "genes", label: "Overlapping Genes", icon: Dna },
          { id: "regulatory", label: "Regulatory Elements", icon: GitBranch },
          { id: "conservation", label: "Conservation", icon: Activity },
          { id: "datasets", label: "Associated Datasets", icon: Database },
        ]
      case "track":
        return [
          { id: "overview", label: "Overview", icon: Info },
          { id: "study-design", label: "Study Design", icon: Settings },
          { id: "subjects-samples", label: "Subjects & Samples", icon: Users },
          { id: "related-tracks", label: "Related Tracks", icon: GitBranch },
          { id: "downloads", label: "Downloads", icon: Download },
          { id: "visualization", label: "Visualization", icon: Eye },
        ]
      default:
        return []
    }
  }

  const sidebarItems = getSidebarItems()

  const handleItemClick = (itemId: string, hasChildren = false, parentId?: string) => {
    console.log("Sidebar click:", { itemId, hasChildren, parentId, activeSection })

    if (hasChildren) {
      // This is a parent item with children - toggle expansion and set first child as active
      toggleSection(itemId)
      const parentItem = sidebarItems.find((item) => item.id === itemId)
      if (parentItem && parentItem.children && parentItem.children.length > 0) {
        const firstChildId = parentItem.children[0].id
        setActiveSection(firstChildId)
        router.push(`/records/${type}/${record.symbol || record.id}?section=${firstChildId}`, { scroll: false })
      }
    } else if (parentId) {
      // This is a child item - set it as the active section directly
      setActiveSection(itemId)
      router.push(`/records/${type}/${record.symbol || record.id}?section=${itemId}`, { scroll: false })
    } else {
      // This is a standalone item
      setActiveSection(itemId)
      router.push(`/records/${type}/${record.symbol || record.id}?section=${itemId}`, { scroll: false })
    }
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const renderSidebarItem = (item: SidebarItem, level = 0, parentId?: string) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedSections.has(item.id)
    const isActive = activeSection === item.id || (parentId && activeSection === item.id)
    const isChild = level > 0

    return (
      <div key={item.id}>
        <button
          className={`record-sidebar-item ${isActive ? "active" : ""} ${isChild ? "child" : ""}`}
          onClick={() => handleItemClick(item.id, hasChildren, parentId)}
          aria-current={isActive ? "page" : undefined}
          aria-expanded={hasChildren ? isExpanded : undefined}
        >
          <item.icon className="record-sidebar-item-icon" size={18} aria-hidden="true" />
          <span className="record-sidebar-item-text">{item.label}</span>
          {hasChildren && (
            <span className="record-sidebar-chevron">
              {isExpanded ? (
                <ChevronDown size={16} aria-hidden="true" />
              ) : (
                <ChevronRight size={16} aria-hidden="true" />
              )}
            </span>
          )}
        </button>
        {hasChildren && isExpanded && (
          <div>{item.children?.map((child) => renderSidebarItem(child, level + 1, item.id))}</div>
        )}
      </div>
    )
  }

  if (!record) return null

  return (
    <div className={`record-sidebar ${isOpen ? "expanded" : "collapsed"}`}>
      <div className="record-sidebar-header">
        <h2 className="record-sidebar-title">
          {type === "gene" && <span className="gene-symbol">{record.symbol}</span>}
          {type === "variant" && <span className="variant-id">{record.id}</span>}
          {type === "span" && <span className="span-id">{record.id}</span>}
          {type === "track" && <span className="track-name">{record.name || record.id}</span>}
        </h2>
        <button
          className="record-sidebar-toggle"
          onClick={onToggle}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="record-sidebar-nav" role="navigation" aria-label="Record navigation">
        {sidebarItems.map((item) => renderSidebarItem(item))}
      </nav>

      {isOpen && (
        <div className="record-sidebar-footer">
          <div className="record-type-badge">{type}</div>
          <div className="record-id">{type === "gene" ? record.symbol : record.id}</div>
        </div>
      )}
    </div>
  )
}
