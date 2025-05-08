
import React, { useState } from 'react';
import { Tournament } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Share2, Copy, Check, Link as LinkIcon } from 'lucide-react';

interface SharingSectionProps {
  tournament: Tournament;
  shareLink: string;
}

const SharingSection = ({ tournament, shareLink }: SharingSectionProps) => {
  const [accessCodeCopied, setAccessCodeCopied] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        if (type === 'code') {
          setAccessCodeCopied(true);
          setTimeout(() => setAccessCodeCopied(false), 2000);
        } else {
          setShareLinkCopied(true);
          setTimeout(() => setShareLinkCopied(false), 2000);
        }
        
        toast({
          title: "Copied to clipboard",
          description: `${type === 'code' ? 'Access code' : 'Shareable link'} copied to clipboard.`,
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Failed to copy",
          description: "Please try again or copy manually.",
          variant: "destructive"
        });
      });
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-blue-600" />
          <span className="text-blue-800">Tournament Sharing</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="rounded-lg bg-white p-4 border border-blue-100 shadow-sm">
            <div className="font-medium text-sm text-blue-900 mb-2 flex items-center gap-1">
              <LinkIcon className="h-4 w-4" />
              Share Link
            </div>
            <div className="flex items-center gap-2">
              <Input 
                className="font-mono text-sm bg-gray-50" 
                value={shareLink}
                readOnly
              />
              <Button 
                size="sm" 
                className={shareLinkCopied ? "bg-green-600" : "bg-blue-600"} 
                onClick={() => copyToClipboard(shareLink, 'link')}
              >
                {shareLinkCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-4 border border-blue-100 shadow-sm">
            <div className="font-medium text-sm text-blue-900 mb-2">Access Code</div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 font-mono bg-gray-50 border rounded-md flex-1 text-center text-lg tracking-wider font-bold">
                {tournament.accessCode}
              </div>
              <Button 
                size="sm" 
                className={accessCodeCopied ? "bg-green-600" : "bg-blue-600"} 
                onClick={() => copyToClipboard(tournament.accessCode || '', 'code')}
              >
                {accessCodeCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SharingSection;
