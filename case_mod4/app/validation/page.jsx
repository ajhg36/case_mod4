import MailValidationForm from '@/app/components/MailValidationForm';
 
export default function MailValidationPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32 text-gray-900">
        <MailValidationForm />
      </div>
    </main>
  );
}