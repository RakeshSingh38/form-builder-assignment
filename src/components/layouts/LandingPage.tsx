'use client';

import { useState, useEffect } from 'react';
import { FormBuilder } from '@/components/form-builder/FormBuilder';
import { CustomThemeProvider } from '@/contexts/CustomThemeContext';
import { downloadFile } from '@/utils/fileUtils';
import { Loader } from '@/components/ui';
import { FormConfig } from '@/types/form';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [showHero, setShowHero] = useState(true);

    useEffect(() => {
        // Show loader for 2 seconds
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleSave = (formConfig: FormConfig) => {
        console.log('Saving form:', formConfig);
    };

    const handleExport = (formConfig: FormConfig) => {
        const filename = formConfig.title.replace(/[^a-zA-Z0-9]/g, '_') + '.json';
        downloadFile(formConfig, filename);
    };

    const handleGetStarted = () => {
        setShowHero(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (showHero) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

                    {/* Navigation */}
                    <nav className="relative z-10 px-6 py-4">
                        <div className="max-w-7xl mx-auto flex items-center">
                            <div className="flex items-center space-x-3">
                                <Image
                                    src="/logo.png"
                                    alt="FormBuilder Logo"
                                    width={32}
                                    height={32}
                                    className="rounded-lg"
                                />
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    FormBuilder
                                </span>
                            </div>
                        </div>
                    </nav>

                    {/* Hero Content */}
                    <div className="relative z-10 px-6 py-20 min-h-[calc(100vh-5rem)] flex items-center">
                        <div className="max-w-4xl mx-auto text-center w-full">

                            <h1 className="text-5xl md:text-7xl font-bold mb-6">
                                <span className="text-gray-800">
                                    Create Forms
                                </span>
                                <br />
                                <span className="text-gray-800">In Minutes, Not Hours</span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Build responsive forms easily with drag-and-drop
                            </p>

                            <div className="flex justify-center">
                                <button
                                    onClick={handleGetStarted}
                                    className="px-10 py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-800 hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Start Building
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <CustomThemeProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <FormBuilder
                    onSave={handleSave}
                    onExport={handleExport}
                />
            </div>
        </CustomThemeProvider>
    );
}
