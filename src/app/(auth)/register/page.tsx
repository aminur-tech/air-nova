'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '../../../services/api';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ShieldCheck, User, Globe, ShieldAlert, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface ValidationErrorItem {
    type: string;
    msg: string;
    path: string;
    location: string;
}

interface ApiErrorPayload {
    success: boolean;
    errors?: ValidationErrorItem[];
    message?: string;
}

const Register = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [globalError, setGlobalError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '', password: '', fullName: '', phone_number: '',
        date_of_birth: '', gender: 'Male', nationality: '',
        passport_number: '', nid_number: '',
        emergency_contact: { name: '', relationship: '', phone: '' },
        address: { street: '', city: '', state: '', country: '', zip: '' }
    });

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    //  snake_case
    const getFieldError = (fieldPath: string) => fieldErrors[fieldPath] || null;

    const handleFormSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step !== 3) return nextStep();

        setLoading(true);
        setGlobalError(null);
        setFieldErrors({});

        try {
            const structuredPayload = {
                email: formData.email.trim(),
                password: formData.password,
                full_name: formData.fullName.trim(),
                phone_number: formData.phone_number.trim(),
                date_of_birth: formData.date_of_birth,
                gender: formData.gender,
                nationality: formData.nationality.trim(),
                passport_number: formData.passport_number.trim().toUpperCase(),
                nid_number: formData.nid_number ? formData.nid_number.trim() : null,
                emergency_contact: formData.emergency_contact,
                address: formData.address
            };

            const res = await api.post('/auth/register', structuredPayload);

            if (res.data.success) {
                router.push('/login?registered=true');
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ApiErrorPayload>;
                const errorData = axiosError.response?.data;

                if (errorData?.errors && Array.isArray(errorData.errors)) {
                    const errorsMap: Record<string, string> = {};
                    errorData.errors.forEach((validationErr) => {
                        errorsMap[validationErr.path] = validationErr.msg;
                    });
                    setFieldErrors(errorsMap);
                    setGlobalError('Profile compilation contains missing or incorrect validation specifications.');
                } else {
                    setGlobalError(errorData?.message || axiosError.message || 'Registration failed.');
                }
            } else {
                setGlobalError('An unexpected architectural error occurred.');
            }
        } finally {
            loading && setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">

                {/* Header & Stepper */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Create Passenger ID Profile</h1>
                        <p className="text-sm text-slate-400 mt-1">Fields must match official documentation exactly.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <span className={`px-2.5 py-1 rounded-md ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-800'}`}>1</span>
                        <div className="w-4 h-0.5 bg-slate-800" />
                        <span className={`px-2.5 py-1 rounded-md ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-800'}`}>2</span>
                        <div className="w-4 h-0.5 bg-slate-800" />
                        <span className={`px-2.5 py-1 rounded-md ${step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-800'}`}>3</span>
                    </div>
                </div>

                {globalError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                        <span>{globalError}</span>
                    </div>
                )}

                <form onSubmit={handleFormSubmission} className="space-y-6">

                    {/* STEP 1: ACCOUNT & CORE IDENTITY DATA */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-400 font-medium text-sm mb-2">
                                <User className="w-4 h-4" /> <span>Account Credentials & Legal Name</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Full Legal Name (as in Passport)</label>
                                    <input type="text" required className={`w-full bg-slate-950 border ${getFieldError('full_name') ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'} rounded-xl px-4 py-2.5 text-sm focus:outline-none`}
                                        value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                                    {getFieldError('full_name') && <p className="text-xs text-red-400 mt-1">{getFieldError('full_name')}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Email Address</label>
                                    <input type="email" required className={`w-full bg-slate-950 border ${getFieldError('email') ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'} rounded-xl px-4 py-2.5 text-sm focus:outline-none`}
                                        value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    {getFieldError('email') && <p className="text-xs text-red-400 mt-1">{getFieldError('email')}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            className={`w-full bg-slate-950 border ${getFieldError('password') ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'} rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none`}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {getFieldError('password') && <p className="text-xs text-red-400 mt-1">{getFieldError('password')}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Phone Number</label>
                                    <input type="text" required className={`w-full bg-slate-950 border ${getFieldError('phone_number') ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'} rounded-xl px-4 py-2.5 text-sm focus:outline-none`}
                                        value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} />
                                    {getFieldError('phone_number') && <p className="text-xs text-red-400 mt-1">{getFieldError('phone_number')}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: TRAVEL CRITERIA & DEMOGRAPHICS */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-400 font-medium text-sm mb-2">
                                <Globe className="w-4 h-4" /> <span>Demographics & Document Numbers</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Date of Birth</label>
                                    <input type="date" required className={`w-full bg-slate-950 border ${getFieldError('date_of_birth') ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'} rounded-xl px-4 py-2.5 text-sm focus:outline-none text-slate-400`}
                                        value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} />
                                    {getFieldError('date_of_birth') && <p className="text-xs text-red-400 mt-1">{getFieldError('date_of_birth')}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Gender</label>
                                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none text-slate-300"
                                        value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Nationality</label>
                                    <input type="text" required placeholder="e.g. British" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                        value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Passport Number (Required)</label>
                                    <input type="text" required className={`w-full bg-slate-950 border ${getFieldError('passport_number') ? 'border-red-500/60 focus:border-red-500' : 'border-slate-800 focus:border-blue-500'} rounded-xl px-4 py-2.5 text-sm focus:outline-none uppercase`}
                                        value={formData.passport_number} onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })} />
                                    {getFieldError('passport_number') && <p className="text-xs text-red-400 mt-1">{getFieldError('passport_number')}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">National ID Number (Optional)</label>
                                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                        value={formData.nid_number} onChange={(e) => setFormData({ ...formData, nid_number: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: EMERGENCY CONTACTS & ADDRESS */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-400 font-medium text-sm mb-2">
                                <ShieldAlert className="w-4 h-4" /> <span>Emergency Contacts & Physical Address</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500">Contact Name</label>
                                    <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                                        value={formData.emergency_contact.name} onChange={(e) => setFormData({ ...formData, emergency_contact: { ...formData.emergency_contact, name: e.target.value } })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500">Relationship</label>
                                    <input type="text" required placeholder="e.g. Spouse" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                                        value={formData.emergency_contact.relationship} onChange={(e) => setFormData({ ...formData, emergency_contact: { ...formData.emergency_contact, relationship: e.target.value } })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500">Emergency Phone</label>
                                    <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                                        value={formData.emergency_contact.phone} onChange={(e) => setFormData({ ...formData, emergency_contact: { ...formData.emergency_contact, phone: e.target.value } })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">Street Address</label>
                                    <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                        value={formData.address.street} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400">City</label>
                                    <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                        value={formData.address.city} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NAVIGATION MATRIX */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={step === 1}
                            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 text-sm"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            ) : step === 3 ? (
                                <> <ShieldCheck className="w-4 h-4" /> Submit Profile Specs </>
                            ) : (
                                <> Continue <ArrowRight className="w-4 h-4" /> </>
                            )}
                        </button>
                    </div>
                </form>

                <p className="text-center text-xs text-slate-500">
                    Already registered?{' '}
                    <Link href="/login" className="text-blue-400 hover:underline">Sign in with credentials</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;