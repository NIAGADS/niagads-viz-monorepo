"use client"

import { ExternalLink, Eye, Download, Share2, FileText } from "lucide-react"
import type { TrackRecord as TrackRecordType } from "./types"
import Placeholder from "./placeholder"
import "./record.css"
import "./placeholder.css"

interface TrackRecordProps {
  record: TrackRecordType
  activeSection: string
}

export function TrackRecord({ record, activeSection }: TrackRecordProps) {
  // Format sample counts from study_diagnosis
  const formatSampleCounts = () => {
    if (!record.subject_phenotypes?.study_diagnosis) return null

    const totalCases = record.subject_phenotypes.study_diagnosis.reduce((sum, study) => sum + (study.num_cases || 0), 0)
    const totalControls = record.subject_phenotypes.study_diagnosis.reduce(
      (sum, study) => sum + (study.num_controls || 0),
      0,
    )

    return { cases: totalCases, controls: totalControls, total: totalCases + totalControls }
  }

  const sampleCounts = formatSampleCounts()

  // Format file size (might want to fetch this from the actual file)
  const getFileSize = () => {
    return "2.3 GB" // placeholder
  }

  // Handle action clicks
  const handleViewInGenomeBrowser = () => {
    window.open(`/genome-browser?track=${record.id}`, "_blank")
  }

  const handleExport = () => {
    window.open(`/export?type=track&id=${record.id}`, "_blank")
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const handleDownload = () => {
    window.open(record.file_properties.url, "_blank")
  }

  return (
    <div className="record-container">
      {/* Action Bar */}
      <div className="action-bar">
        <div className="gene-identifier">
          <span className="gene-symbol">{record.name}</span>
          <span className="gene-name">{record.id}</span>
        </div>

        <div className="action-buttons">
          <button className="action-button" onClick={handleViewInGenomeBrowser} title="View in Genome Browser">
            <Eye size={16} />
            View in Genome Browser
          </button>
          <button className="action-button" onClick={handleExport} title="Export Track Data">
            <FileText size={16} />
            Export
          </button>
          <button className="action-button" onClick={handleShare} title="Share Track Record">
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      {/* Section Content */}
      <div className="record-content-section">
        {activeSection === "overview" && (
          <div className="overview-section">
            <div className="overview-grid">
              {/* Track Information Card - 1/3 width */}
              <div className="card card-third">
                <h3>Track Information</h3>
                <div className="gene-info-content">
                  <div className="gene-title">
                    <span className="gene-symbol">{record.name}</span>
                  </div>

                  <div className="gene-details">
                    <div className="gene-id">{record.id}</div>

                    <div className="gene-type">
                      <span className="info-label">Analysis Type:</span> {record.experimental_design.analysis}
                    </div>

                    <div className="gene-location">
                      <span className="info-label">Genome Build:</span> {record.genome_build}
                    </div>

                    <div className="gene-location">
                      <span className="info-label">Feature Type:</span> {record.feature_type}
                    </div>
                  </div>
                </div>
              </div>

              {/* Study Information Card - 1/3 width */}
              <div className="card card-third">
                <h3>Study Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Data Source:</span>
                    <span className="info-value">{record.provenance.data_source}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Accession:</span>
                    <span className="info-value">{record.provenance.accession}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Attribution:</span>
                    <span className="info-value">{record.provenance.attribution}</span>
                  </div>
                  {sampleCounts && (
                    <div className="info-item">
                      <span className="info-label">Total Samples:</span>
                      <span className="info-value">{sampleCounts.total.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* File Information Card - 1/3 width */}
              <div className="card card-third">
                <h3>File Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Format:</span>
                    <span className="info-value">{record.file_properties.file_format.toUpperCase()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Schema:</span>
                    <span className="info-value">{record.file_properties.file_schema || "Standard"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Size:</span>
                    <span className="info-value">{getFileSize()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Download:</span>
                    <button className="download-link" onClick={handleDownload}>
                      <Download size={14} />
                      Download File
                    </button>
                  </div>
                </div>
              </div>

              {/* Description Card - Full width */}
              <div className="card card-full">
                <h3>Description</h3>
                <p>{record.description}</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "study-design" && (
          <div className="study-design-section">
            <div className="card">
              <h3>Experimental Design</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Analysis:</span>
                  <span className="info-value">{record.experimental_design.analysis}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Classification:</span>
                  <span className="info-value">{record.experimental_design.classification}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Data Category:</span>
                  <span className="info-value">{record.experimental_design.data_category}</span>
                </div>
                {record.experimental_design.is_lifted && (
                  <div className="info-item">
                    <span className="info-label">Genome Lift:</span>
                    <span className="info-value">Lifted to {record.genome_build}</span>
                  </div>
                )}
              </div>

              {record.experimental_design.covariates && (
                <div className="mt-4">
                  <h4>Covariates</h4>
                  <div className="covariate-list">
                    {record.experimental_design.covariates.map((covariate, index) => (
                      <span key={index} className="covariate-badge">
                        {covariate}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {record.provenance.pubmed_id && (
              <div className="card">
                <h3>Publications</h3>
                <div className="publication-list">
                  {record.provenance.pubmed_id.map((pmid, index) => (
                    <div key={index} className="publication-item">
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${pmid.replace("PMID:", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        <ExternalLink size={16} />
                        {pmid}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === "subjects-samples" && (
          <div className="subjects-samples-section">
            {record.subject_phenotypes && (
              <div className="card">
                <h3>Subject Phenotypes</h3>

                {record.subject_phenotypes.disease && (
                  <div className="phenotype-section">
                    <h4>Disease</h4>
                    <div className="phenotype-list">
                      {record.subject_phenotypes.disease.map((disease, index) => (
                        <span key={index} className="phenotype-badge">
                          {disease}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {record.subject_phenotypes.ethnicity && (
                  <div className="phenotype-section">
                    <h4>Ethnicity</h4>
                    <div className="phenotype-list">
                      {record.subject_phenotypes.ethnicity.map((ethnicity, index) => (
                        <span key={index} className="phenotype-badge">
                          {ethnicity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {record.subject_phenotypes.study_diagnosis && (
                  <div className="phenotype-section">
                    <h4>Study Diagnosis</h4>
                    <div className="diagnosis-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Phenotype</th>
                            <th>Cases</th>
                            <th>Controls</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {record.subject_phenotypes.study_diagnosis.map((diagnosis, index) => (
                            <tr key={index}>
                              <td>{diagnosis.phenotype?.term || "All"}</td>
                              <td>{diagnosis.num_cases?.toLocaleString() || "—"}</td>
                              <td>{diagnosis.num_controls?.toLocaleString() || "—"}</td>
                              <td>{((diagnosis.num_cases || 0) + (diagnosis.num_controls || 0)).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {record.biosample_characteristics && (
              <div className="card">
                <h3>Biosample Characteristics</h3>
                <div className="biosample-grid">
                  {record.biosample_characteristics.tissue && (
                    <div className="biosample-item">
                      <span className="info-label">Tissue:</span>
                      <div className="biosample-values">
                        {record.biosample_characteristics.tissue.map((tissue, index) => (
                          <span key={index} className="biosample-badge">
                            {tissue}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {record.biosample_characteristics.biomarker && (
                    <div className="biosample-item">
                      <span className="info-label">Biomarker:</span>
                      <div className="biosample-values">
                        {record.biosample_characteristics.biomarker.map((biomarker, index) => (
                          <span key={index} className="biosample-badge">
                            {biomarker}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {record.cohorts && (
              <div className="card">
                <h3>Cohorts</h3>
                <div className="cohort-list">
                  {record.cohorts.map((cohort, index) => (
                    <span key={index} className="cohort-badge">
                      {cohort}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === "related-tracks" && (
          <div className="related-tracks-section">
            <div className="card">
              <h3>Related Tracks</h3>
              <p>Tracks from the same study collection: {record.provenance.accession}</p>
              <Placeholder type="list">
                <div className="placeholder-text">Related tracks will be loaded from collection endpoint</div>
              </Placeholder>
            </div>
          </div>
        )}

        {activeSection === "downloads" && (
          <div className="downloads-section">
            <div className="card">
              <h3>Available Downloads</h3>
              <div className="download-list">
                <div className="download-item">
                  <div className="download-info">
                    <span className="download-name">{record.file_properties.file_name}</span>
                    <span className="download-details">
                      {record.file_properties.file_format.toUpperCase()} • {getFileSize()}
                    </span>
                  </div>
                  <button className="download-button" onClick={handleDownload}>
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "visualization" && (
          <div className="visualization-section">
            <div className="card">
              <h3>Genome Browser View</h3>
              <Placeholder type="chart" height={500}>
                <div className="placeholder-text">Genome browser visualization will be displayed here</div>
              </Placeholder>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
