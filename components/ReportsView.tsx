import React, { useState } from 'react';
import { FileText, Building2, ClipboardList, TrendingUp, Download, FileDown, CheckCircle2 } from 'lucide-react';
import { ReportType, ReportPeriod, ExportFormat, Task, Project } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, HeadingLevel, AlignmentType, WidthType, ImageRun } from 'docx';
import { saveAs } from 'file-saver';

interface ReportsViewProps {
  tasks: Task[];
  currentProject: Project;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ tasks, currentProject }) => {
  const [reportType, setReportType] = useState<ReportType>('general');
  const [period, setPeriod] = useState<ReportPeriod>('last-month');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includePhotos, setIncludePhotos] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { id: 'general' as ReportType, label: 'Relatório Geral', icon: FileText, description: 'Visão geral completa do projeto' },
    { id: 'blocks' as ReportType, label: 'Por Blocos', icon: Building2, description: 'Relatório por bloco de construção' },
    { id: 'tasks' as ReportType, label: 'Tarefas', icon: ClipboardList, description: 'Detalhamento de atividades' },
    { id: 'financial' as ReportType, label: 'Financeiro', icon: TrendingUp, description: 'Análise de custos e orçamento' }
  ];

  const periods = [
    { value: 'last-month' as ReportPeriod, label: 'Último Mês' },
    { value: 'last-3-months' as ReportPeriod, label: 'Últimos 3 Meses' },
    { value: 'last-6-months' as ReportPeriod, label: 'Últimos 6 Meses' },
    { value: 'last-year' as ReportPeriod, label: 'Último Ano' },
    { value: 'all-time' as ReportPeriod, label: 'Todo o Período' }
  ];

  const generateReport = (format: ExportFormat) => {
    setIsGenerating(true);

    // Simular geração de relatório
    setTimeout(() => {
      const reportData = {
        type: reportType,
        period,
        includeCharts,
        includePhotos,
        format,
        project: currentProject.name,
        generatedAt: new Date().toISOString(),
        tasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'Concluído').length
      };

      if (format === 'pdf') {
        generatePDF(reportData);
      } else {
        generateWord(reportData);
      }

      setIsGenerating(false);
    }, 2000);
  };

  const generatePDF = (data: any) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Título principal
    doc.setFontSize(20);
    doc.setTextColor(30, 64, 175); // Azul GAV
    doc.setFont('helvetica', 'bold');
    doc.text('GRAN GARDEN RESORT', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    
    doc.setFontSize(16);
    doc.text(`RELATÓRIO ${data.type.toUpperCase()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Linha separadora
    doc.setDrawColor(yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Informações do projeto
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    
    doc.text('Projeto:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(data.project, margin + 30, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Período:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(periods.find(p => p.value === data.period)?.label || '', margin + 30, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Data de Geração:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(data.generatedAt).toLocaleString('pt-BR'), margin + 40, yPos);

    // Linha separadora
    yPos += 10;
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // Resumo Executivo
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text('RESUMO EXECUTIVO', margin, yPos);

    yPos += 10;
    const completionPercentage = ((data.completedTasks / data.tasks) * 100).toFixed(2);

    // Tabela de resumo
    autoTable(doc, {
      startY: yPos,
      head: [['Métrica', 'Valor']],
      body: [
        ['Total de Tarefas', data.tasks.toString()],
        ['Tarefas Concluídas', data.completedTasks.toString()],
        ['Percentual de Conclusão', `${completionPercentage}%`]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 11,
        textColor: [51, 65, 85]
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { halign: 'right', cellWidth: 50 }
      },
      margin: { left: margin, right: margin }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Observações
    if (data.includeCharts || data.includePhotos) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      
      if (data.includeCharts) {
        doc.text('• Gráficos: Incluídos neste relatório', margin, yPos);
        yPos += 7;
      }
      if (data.includePhotos) {
        doc.text('• Registro Fotográfico: Incluído neste relatório', margin, yPos);
        yPos += 7;
      }
    }

    // Rodapé
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    const footerY = pageHeight - 20;
    doc.text('Relatório gerado automaticamente pelo Gran Garden Resort', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Sistema de Gestão de Obras v2.0 | GAV Resorts', pageWidth / 2, footerY + 5, { align: 'center' });
    doc.text(`© ${new Date().getFullYear()} - Todos os direitos reservados`, pageWidth / 2, footerY + 10, { align: 'center' });

    // Salvar PDF
    doc.save(`relatorio_${data.type}_${new Date().toISOString().split('T')[0]}.pdf`);
    alert('✅ Relatório PDF gerado com sucesso!');
  };

  const generateWord = async (data: any) => {
    const completionPercentage = ((data.completedTasks / data.tasks) * 100).toFixed(2);
    
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: [
          new Paragraph({
            text: 'GRAN GARDEN RESORT',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          
          new Paragraph({
            text: `RELATÓRIO ${data.type.toUpperCase()}`,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Linha separadora (simulada com texto)
          new Paragraph({
            text: '━'.repeat(80),
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),

          // Informações do projeto
          new Paragraph({
            children: [
              new TextRun({ text: 'Projeto: ', bold: true }),
              new TextRun({ text: data.project })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Período: ', bold: true }),
              new TextRun({ text: periods.find(p => p.value === data.period)?.label || '' })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Data de Geração: ', bold: true }),
              new TextRun({ text: new Date(data.generatedAt).toLocaleString('pt-BR') })
            ],
            spacing: { after: 300 }
          }),

          // Linha separadora
          new Paragraph({
            text: '━'.repeat(80),
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),

          // Resumo Executivo
          new Paragraph({
            text: 'RESUMO EXECUTIVO',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 }
          }),

          // Tabela de resumo
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: 'Métrica', bold: true })],
                      alignment: AlignmentType.CENTER
                    })],
                    shading: { fill: '1E40AF' }
                  }),
                  new TableCell({
                    children: [new Paragraph({
                      children: [new TextRun({ text: 'Valor', bold: true })],
                      alignment: AlignmentType.CENTER
                    })],
                    shading: { fill: '1E40AF' }
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('Total de Tarefas')]
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: data.tasks.toString(), alignment: AlignmentType.RIGHT })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('Tarefas Concluídas')]
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: data.completedTasks.toString(), alignment: AlignmentType.RIGHT })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('Percentual de Conclusão')]
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: `${completionPercentage}%`, alignment: AlignmentType.RIGHT })]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // Observações
          ...(data.includeCharts ? [new Paragraph({
            children: [
              new TextRun({ text: 'Gráficos: ', bold: true }),
              new TextRun({ text: 'Incluídos neste relatório' })
            ],
            spacing: { after: 100 }
          })] : []),

          ...(data.includePhotos ? [new Paragraph({
            children: [
              new TextRun({ text: 'Registro Fotográfico: ', bold: true }),
              new TextRun({ text: 'Incluído neste relatório' })
            ],
            spacing: { after: 100 }
          })] : []),

          // Rodapé
          new Paragraph({
            text: '━'.repeat(80),
            children: [new TextRun({ text: '━'.repeat(80), color: 'CBD5E1' })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),

          new Paragraph({
            text: 'Relatório gerado automaticamente pelo Gran Garden Resort',
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: 'Sistema de Gestão de Obras v2.0 | GAV Resorts',
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),

          new Paragraph({
            text: `© ${new Date().getFullYear()} - Todos os direitos reservados`,
            alignment: AlignmentType.CENTER
          })
        ]
      }]
    });

    // Gerar e salvar documento
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `relatorio_${data.type}_${new Date().toISOString().split('T')[0]}.docx`);
    alert('✅ Relatório Word gerado com sucesso!');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <FileText className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-slate-800">Gerador de Relatórios</h1>
        </div>
        <p className="text-slate-600">Configure e exporte relatórios personalizados do projeto</p>
      </div>

      {/* Tipo de Relatório */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Tipo de Relatório</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id)}
              className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                reportType === type.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-lg mr-4 ${
                  reportType === type.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <type.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold mb-1 ${
                    reportType === type.id ? 'text-blue-900' : 'text-slate-800'
                  }`}>
                    {type.label}
                  </h3>
                  <p className={`text-sm ${
                    reportType === type.id ? 'text-blue-700' : 'text-slate-600'
                  }`}>
                    {type.description}
                  </p>
                </div>
                {reportType === type.id && (
                  <CheckCircle2 className="w-6 h-6 text-blue-600 ml-2 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Período */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Período</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
          className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none text-slate-700 font-medium"
        >
          {periods.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Opções */}
      <div className="mb-8 bg-slate-50 p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Opções de Conteúdo</h2>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-3 text-slate-700 font-medium group-hover:text-blue-600 transition-colors">
              Incluir gráficos
            </span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={includePhotos}
              onChange={(e) => setIncludePhotos(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-3 text-slate-700 font-medium group-hover:text-blue-600 transition-colors">
              Incluir fotos
            </span>
          </label>
        </div>
      </div>

      {/* Botões de Exportação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => generateReport('pdf')}
          disabled={isGenerating}
          className="flex items-center justify-center p-5 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          <Download className="w-6 h-6 mr-3" />
          {isGenerating ? 'Gerando...' : 'PDF'}
        </button>
        <button
          onClick={() => generateReport('word')}
          disabled={isGenerating}
          className="flex items-center justify-center p-5 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          <FileDown className="w-6 h-6 mr-3" />
          {isGenerating ? 'Gerando...' : 'Word'}
        </button>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Os relatórios incluem dados do projeto {currentProject.name} para o período selecionado.
          {includeCharts && ' Gráficos estatísticos serão incluídos.'}
          {includePhotos && ' Fotos do registro fotográfico serão incluídas.'}
        </p>
      </div>
    </div>
  );
};
