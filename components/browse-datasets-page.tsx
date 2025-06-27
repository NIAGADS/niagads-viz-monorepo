"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Download, Filter, Search } from "lucide-react"
import { EnhancedSearchComponent } from "@/components/enhanced-search-component"
import "./table.css"
import "./action-button.css"

export function BrowseDatasetsPage() {
  const [selectedDatasets, setSelectedDatasets] = useState<Set<string>>(new Set())
  const router = useRouter()

  const datasets = [
    {
      id: "rosmap",
      name: "ROSMAP Brain xQTL",
      tissue: "Multiple Brain Regions",
      samples: "1,019",
      variants: "7.8M",
      genes: "18,456",
      size: "2.3 GB",
      status: "Available",
    },
    {
      id: "mayo",
      name: "Mayo Clinic Brain Bank",
      tissue: "Temporal Cortex",
      samples: "278",
      variants: "6.2M",
      genes: "15,234",
      size: "1.8 GB",
      status: "Available",
    },
    {
      id: "mount-sinai",
      name: "Mount Sinai Brain Bank",
      tissue: "Frontal Cortex",
      samples: "364",
      variants: "5.9M",
      genes: "16,789",
      size: "2.1 GB",
      status: "Processing",
    },
    {
      id: "banner",
      name: "Banner Sun Health",
      tissue: "Multiple Brain Regions",
      samples: "218",
      variants: "4.3M",
      genes: "14,567",
      size: "1.5 GB",
      status: "Available",
    },
  ]

  const suggestions = ["APOE", "TREM2", "APP", "PSEN1", "MAPT", "CLU", "CR1", "PICALM", "rs429358"]

  const handleDatasetSelect = (id: string) => {
    const newSelected = new Set(selectedDatasets)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedDatasets(newSelected)
  }

  return (
    <div className="max-text-width">
      <div className="content-header">
        <div>
          <h1 className="content-title">Browse Datasets</h1>
          <p className="content-subtitle">Explore genomic datasets and search for genes, variants, and associations</p>
        </div>
        <div className="action-buttons">
          <button className="action-button">
            <Download size={16} aria-hidden="true" />
            Export
          </button>
          <button className="action-button">Share</button>
        </div>
      </div>

      {/* Main Search Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Search Genomic Data</div>
            <div className="card-subtitle">Search for genes, variants, tissues, or genomic regions</div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <EnhancedSearchComponent
            placeholder="Search genes, variants, tissues (e.g., APOE, rs429358, chr19:44905791-44909393)"
            suggestions={suggestions}
            showTypeHints={true}
            autoRoute={true}
          />
          <button className="action-button">
            <Filter size={16} aria-hidden="true" />
            Advanced Search
          </button>
        </div>
        <div className="text-sm text-secondary">
          Try searching for: <span className="font-medium">APOE</span>, <span className="font-medium">rs429358</span>,
          or <span className="font-medium">Alzheimer's disease</span>
        </div>
      </div>

      {/* Available Datasets Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Available Datasets</div>
            <div className="card-subtitle">
              {selectedDatasets.size > 0 && `${selectedDatasets.size} selected • `}
              Browse and select datasets for analysis
            </div>
          </div>
          <div className="flex gap-2">
            {selectedDatasets.size > 0 && (
              <button className="action-button primary">
                <Search size={16} aria-hidden="true" />
                Search Selected
              </button>
            )}
            <button className="action-button">
              <Download size={16} aria-hidden="true" />
              Download Metadata
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table" role="table">
            <thead>
              <tr role="row">
                <th role="columnheader">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDatasets(new Set(datasets.map((item) => item.id)))
                      } else {
                        setSelectedDatasets(new Set())
                      }
                    }}
                    checked={selectedDatasets.size === datasets.length}
                    aria-label="Select all datasets"
                  />
                </th>
                <th role="columnheader">Dataset</th>
                <th role="columnheader">Tissue</th>
                <th role="columnheader">Samples</th>
                <th role="columnheader">Variants</th>
                <th role="columnheader">Genes</th>
                <th role="columnheader">Size</th>
                <th role="columnheader">Status</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((dataset) => (
                <tr key={dataset.id} role="row" className={selectedDatasets.has(dataset.id) ? "selected" : ""}>
                  <td role="gridcell">
                    <input
                      type="checkbox"
                      checked={selectedDatasets.has(dataset.id)}
                      onChange={() => handleDatasetSelect(dataset.id)}
                      aria-label={`Select ${dataset.name}`}
                    />
                  </td>
                  <td role="gridcell">
                    <div className="font-medium text-primary-blue">{dataset.name}</div>
                  </td>
                  <td role="gridcell">{dataset.tissue}</td>
                  <td role="gridcell">{dataset.samples}</td>
                  <td role="gridcell">{dataset.variants}</td>
                  <td role="gridcell">{dataset.genes}</td>
                  <td role="gridcell">{dataset.size}</td>
                  <td role="gridcell">
                    <span className={`status-badge status-${dataset.status.toLowerCase()}`}>{dataset.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

   
    </div>
  )
}
