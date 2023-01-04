export function replaceParams(text: string, params: Record<string, any>): string {
  for (const [key, value] of Object.entries(params)) {
    text = text.replace(`{{${key}}}`, value);
  }
  return text;
}

export const winnerDepositEmailHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
 <html xmlns="http://www.w3.org/1999/xhtml" lang="EN">
   <head>
     <title>
     </title>
     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
   </head>
   <body style="padding:0; margin: 0; font-family: sans-serif;">
     {{series}} {{number}}
   </body>
 </html>`;