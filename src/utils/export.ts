import { SchoolAssessmentSubmission } from '../types';
import { ASSESSMENT_CRITERIA } from '../data/maharashtraData';

/**
 * Generates an Excel-compatible CSV file with UTF-8 BOM (\uFEFF)
 * so that Devanagari (Marathi) text opens perfectly in Microsoft Excel without corrupting fonts.
 */
export function exportAllSubmissionsToExcelCSV(
  submissions: SchoolAssessmentSubmission[],
  filenamePrefix: string = 'Vidya_Pravesh_All_Data'
) {
  if (!submissions || submissions.length === 0) {
    alert('कोणताही डेटा उपलब्ध नाही! (No submission data available to export)');
    return;
  }

  // Define headers
  const headers = [
    'UDISE No (युडीआयएसई क्र.)',
    'District (जिल्हा)',
    'Block/Taluka (तालुका)',
    'Cluster/Center (केंद्र)',
    'School Name (शाळेचे नाव)',
    'School Type (शाळा प्रकार)',
    'Submitted By (सादरकर्ते/शिक्षक)',
    'Month (महिना)',
    'Boys (मुले)',
    'Girls (मुली)',
    'Total Enrolment (एकूण पट)',
  ];

  // Add headers for all 8 criteria (Level 1, Level 2, Level 3 for each)
  ASSESSMENT_CRITERIA.forEach((crit) => {
    const title = crit.marathiLabel.replace(/,/g, ' ');
    headers.push(`मुद्दा ${crit.id} - ${title} [श्रेणी १: क्वचित/मदतीची गरज]`);
    headers.push(`मुद्दा ${crit.id} - ${title} [श्रेणी २: कधीकधी/थोड्या प्रयत्नाने]`);
    headers.push(`मुद्दा ${crit.id} - ${title} [श्रेणी ३: नेहमी/सहज करता येते]`);
  });

  headers.push('Submission Date (सबमिशन तारीख)');

  // Helper to sanitize CSV fields (wrap in double quotes, escape internal quotes)
  const sanitizeCell = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows: string[] = [];

  // Header row
  rows.push(headers.map(sanitizeCell).join(','));

  // Data rows
  submissions.forEach((sub) => {
    const row: (string | number)[] = [
      sub.udiseNo || '',
      sub.district || '',
      sub.block || '',
      sub.cluster || '',
      sub.schoolName || '',
      sub.schoolType || '',
      sub.submittedBy || '',
      sub.month || '',
      sub.boysCount || 0,
      sub.girlsCount || 0,
      sub.totalEnrolment || 0,
    ];

    // Append 8 criteria data
    ASSESSMENT_CRITERIA.forEach((crit) => {
      const cData = sub.criteriaData?.[crit.id] || { level1: 0, level2: 0, level3: 0 };
      row.push(cData.level1 || 0);
      row.push(cData.level2 || 0);
      row.push(cData.level3 || 0);
    });

    const dateStr = sub.submittedAt
      ? new Date(sub.submittedAt).toLocaleString('mr-IN')
      : '';
    row.push(dateStr);

    rows.push(row.map(sanitizeCell).join(','));
  });

  // Combine with UTF-8 Byte Order Mark (BOM) \uFEFF
  const csvContent = '\uFEFF' + rows.join('\r\n');

  // Trigger download as .csv (which opens directly in Excel)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const dateTag = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `${filenamePrefix}_${dateTag}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
