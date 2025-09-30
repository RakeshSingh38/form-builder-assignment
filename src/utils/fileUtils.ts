export const downloadFile = (data: unknown, filename: string, type = 'application/json') => {
    const dataStr = JSON.stringify(data, null, 2);
    const link = document.createElement('a');
    link.href = `data:${type};charset=utf-8,` + encodeURIComponent(dataStr);
    link.download = filename.replace(/\s+/g, '_');
    link.click();
};

export const importFile = (file: File): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = JSON.parse(e.target?.result as string);
                resolve(result);
            } catch {
                reject(new Error('Error importing file. Please check the file format.'));
            }
        };
        reader.readAsText(file);
    });
};


