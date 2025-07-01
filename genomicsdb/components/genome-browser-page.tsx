"use client"

import { useState } from "react"
export function GenomeBrowserPage() {
  const [selectedChromosome, setSelectedChromosome] = useState("19")
  const [position, setPosition] = useState("44905791-44909393")

  const chromosomes = Array.from({ length: 22 }, (_, i) => (i + 1).toString()).concat(["X", "Y"])

  const suggestions = ["APOE", "TREM2", "APP", "PSEN1", "chr19:44905791-44909393"]

  return (
    <div className="max-text-width">

      <div className="card" role="tabpanel">
        <div className="card-header">
          <div className="card-title">Genome Visualization</div>
          <div className="text-sm text-secondary">
            Chromosome {selectedChromosome}: {position}
          </div>
        </div>
        <div
          style={{
            height: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dashed var(--border)",
            borderRadius: "var(--border-radius)",
            backgroundColor: "var(--gray-50)",
          }}
        >
          <div className="text-center text-secondary">
            <div className="text-lg mb-2">Interactive Genome Browser</div>
            <div className="text-sm mb-1">Genome visualization will be displayed here</div>
            <div className="text-xs">
              Features: Gene tracks, Variant annotations, Expression data, Regulatory elements
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
