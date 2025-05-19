import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Download, Upload, FileText, AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CsvImportExportProps {
  templateHeaders: string[];
  onImport: (data: any[]) => Promise<void>;
  exportData: any[] | null;
  exportFileName?: string;
  entityName: string;
}

const CsvImportExport: React.FC<CsvImportExportProps> = ({
  templateHeaders,
  onImport,
  exportData,
  exportFileName = 'export.csv',
  entityName,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const generateTemplate = () => {
    const csvContent = templateHeaders.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${entityName.toLowerCase()}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToCsv = () => {
    if (!exportData || exportData.length === 0) return;

    // Get headers from the first object
    const headers = Object.keys(exportData[0]);
    
    // Convert data to CSV
    const csvRows = [
      headers.join(','), // Header row
      ...exportData.map(row => 
        headers.map(header => {
          // Handle values that need quotes (commas, quotes, etc.)
          const value = row[header] === null || row[header] === undefined ? '' : row[header];
          const escapedValue = String(value).replace(/"/g, '""');
          return `"${escapedValue}"`;
        }).join(',')
      )
    ];
    
    const csvContent = csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', exportFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImportStatus('idle');
      setErrorMessage('');
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim());
      const obj: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      
      result.push(obj);
    }
    
    return result;
  };

  const handleImport = async () => {
    if (!file) return;
    
    setImportStatus('loading');
    setErrorMessage('');
    
    try {
      const text = await file.text();
      const data = parseCSV(text);
      
      // Validate the CSV has required headers
      const csvHeaders = Object.keys(data[0] || {});
      const missingHeaders = templateHeaders.filter(h => !csvHeaders.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
      }
      
      await onImport(data);
      setImportStatus('success');
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  return (
    <Tabs defaultValue="import" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="import">Import</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
      </TabsList>
      
      <TabsContent value="import" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange}
              disabled={importStatus === 'loading'} 
            />
            <Button
              onClick={handleImport}
              disabled={!file || importStatus === 'loading'}
              className="shrink-0"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </div>
          
          <Button variant="outline" onClick={generateTemplate} className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          
          {importStatus === 'success' && (
            <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your {entityName.toLowerCase()} data has been imported successfully.
              </AlertDescription>
            </Alert>
          )}
          
          {importStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errorMessage || `Failed to import ${entityName.toLowerCase()} data.`}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="export" className="space-y-4">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Export {entityName} Data</h3>
                <p className="text-sm text-muted-foreground">
                  Download all your {entityName.toLowerCase()} data as a CSV file
                </p>
              </div>
              <Button 
                onClick={exportToCsv} 
                disabled={!exportData || exportData.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
            
            {(!exportData || exportData.length === 0) && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Data</AlertTitle>
                <AlertDescription>
                  There is no {entityName.toLowerCase()} data to export.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CsvImportExport; 