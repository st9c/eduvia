import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

// Export grades to PDF
export function exportGradesToPDF(grades: any[], studentName: string) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text("Grade Report", 14, 20);
  
  // Add student info
  doc.setFontSize(12);
  doc.text(`Student: ${studentName}`, 14, 30);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 37);
  
  // Add table
  (doc as any).autoTable({
    startY: 45,
    head: [['Course', 'Instructor', 'Grade', 'Progress']],
    body: grades.map(g => [
      g.title,
      g.instructor,
      g.grade,
      `${g.progress}%`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  });
  
  // Calculate GPA
  const avgGrade = grades.reduce((sum, g) => sum + g.gradeNumeric, 0) / grades.length;
  const finalY = doc.lastAutoTable?.finalY || 45;
  
  doc.setFontSize(14);
  doc.text(`Average Grade: ${avgGrade.toFixed(2)}%`, 14, finalY + 15);
  
  // Save
  doc.save(`grade-report-${studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}

// Export grades to CSV
export function exportGradesToCSV(grades: any[], studentName: string) {
  const csv = Papa.unparse(grades.map(g => ({
    Course: g.title,
    Instructor: g.instructor,
    Grade: g.grade,
    'Numeric Grade': g.gradeNumeric,
    Progress: `${g.progress}%`,
  })));
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `grades-${studentName.replace(/\s+/g, '-').toLowerCase()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export user list to CSV
export function exportUsersToCSV(users: any[]) {
  const csv = Papa.unparse(users.map(u => ({
    Name: u.name,
    Email: u.email,
    Role: u.role,
    'School ID': u.school_id || 'N/A',
  })));
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export assignment submissions to PDF
export function exportSubmissionsToPDF(submissions: any[], assignmentTitle: string) {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text("Submission Report", 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Assignment: ${assignmentTitle}`, 14, 30);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 37);
  
  (doc as any).autoTable({
    startY: 45,
    head: [['Student', 'Email', 'Submitted', 'Grade', 'Status']],
    body: submissions.map(s => [
      s.student_name,
      s.student_email,
      s.submitted_at || 'Not submitted',
      s.grade !== null ? `${s.grade}/100` : 'Not graded',
      s.status,
    ]),
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  });
  
  const finalY = doc.lastAutoTable?.finalY || 45;
  const gradedCount = submissions.filter(s => s.grade !== null).length;
  const avgGrade = submissions
    .filter(s => s.grade !== null)
    .reduce((sum, s) => sum + s.grade, 0) / gradedCount || 0;
  
  doc.setFontSize(12);
  doc.text(`Total Submissions: ${submissions.length}`, 14, finalY + 10);
  doc.text(`Graded: ${gradedCount}`, 14, finalY + 17);
  doc.text(`Average Grade: ${avgGrade.toFixed(2)}%`, 14, finalY + 24);
  
  doc.save(`submissions-${assignmentTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}

// Export course analytics to PDF
export function exportCourseAnalyticsToPDF(courseData: any) {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text("Course Analytics Report", 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Course: ${courseData.title}`, 14, 30);
  doc.text(`Instructor: ${courseData.instructor}`, 14, 37);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 44);
  
  // Course stats
  doc.setFontSize(14);
  doc.text("Course Statistics", 14, 60);
  
  doc.setFontSize(11);
  doc.text(`Total Students: ${courseData.studentCount}`, 20, 70);
  doc.text(`Total Assignments: ${courseData.assignmentCount}`, 20, 77);
  doc.text(`Average Grade: ${courseData.averageGrade}%`, 20, 84);
  doc.text(`Completion Rate: ${courseData.completionRate}%`, 20, 91);
  
  // Student performance table
  if (courseData.students && courseData.students.length > 0) {
    (doc as any).autoTable({
      startY: 100,
      head: [['Student', 'Assignments Completed', 'Average Grade', 'Status']],
      body: courseData.students.map((s: any) => [
        s.name,
        `${s.completed}/${courseData.assignmentCount}`,
        `${s.avgGrade}%`,
        s.avgGrade >= 60 ? 'Passing' : 'At Risk',
      ]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    });
  }
  
  doc.save(`course-analytics-${courseData.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}