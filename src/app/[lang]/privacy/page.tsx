import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getDictionary } from '@/get-dictionary';

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as 'de' | 'en');

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 text-slate-900">
            <div className="max-w-3xl mx-auto px-6 md:px-12">
                <Link href={`/${lang}`} className="inline-flex items-center text-gmrt-blue hover:text-gmrt-salmon transition-colors mb-8 group">
                    <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" /> {dict.impressum.back_home}
                </Link>

                <h1 className="text-4xl font-bold text-gmrt-blue mb-12">
                    {lang === 'de' ? 'Datenschutz' : 'Privacy Policy'}
                </h1>

                <div className="space-y-8 text-slate-700 leading-relaxed">
                    {lang === 'de' ? (
                        <>
                            <section>
                                <p className="mb-4">Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.</p>

                                <p className="mb-4">Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.</p>

                                <p>Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.</p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Datenschutzerklärung für die Nutzung von Facebook-Plugins (Like-Button)</h3>
                                <p className="mb-4">Auf unseren Seiten sind Plugins des sozialen Netzwerks Facebook, 1601 South California Avenue, Palo Alto, CA 94304, USA integriert. Die Facebook-Plugins erkennen Sie an dem Facebook-Logo oder dem “Like-Button” (“Gefällt mir”) auf unserer Seite.</p>
                                <p className="mb-4">Wenn Sie unsere Seiten besuchen, wird über das Plugin eine direkte Verbindung zwischen Ihrem Browser und dem Facebook-Server hergestellt. Facebook erhält dadurch die Information, dass Sie mit Ihrer IP-Adresse unsere Seite besucht haben. Wenn Sie den Facebook “Like-Button” anklicken während Sie in Ihrem Facebook-Account eingeloggt sind, können Sie die Inhalte unserer Seiten auf Ihrem Facebook-Profil verlinken. Dadurch kann Facebook den Besuch unserer Seiten Ihrem Benutzerkonto zuordnen. Wir weisen darauf hin, dass wir als Anbieter der Seiten keine Kenntnis vom Inhalt der übermittelten Daten sowie deren Nutzung durch Facebook erhalten.</p>
                                <p>Wenn Sie nicht wünschen, dass Facebook den Besuch unserer Seiten Ihrem Facebook-Nutzerkonto zuordnen kann, loggen Sie sich bitte aus Ihrem Facebook-Benutzerkonto aus.</p>
                            </section>

                            <hr className="border-slate-200" />

                            <p className="text-sm text-slate-500">Quelle: <a href="https://www.e-recht24.de/muster-disclaimer.htm" target="_blank" rel="noopener noreferrer" className="hover:text-gmrt-salmon transition-colors">eRecht24</a></p>
                        </>
                    ) : (
                        <>
                            <section>
                                <p className="mb-4">The use of our website is generally possible without providing personal data. Insofar as personal data (e.g. name, address or e-mail addresses) is collected on our pages, this is always done on a voluntary basis as far as possible. This data will not be passed on to third parties without your express consent.</p>
                                <p className="mb-4">We would like to point out that data transmission on the Internet (e.g. when communicating by e-mail) can have security gaps. Complete protection of data against access by third parties is not possible.</p>
                                <p>The use of contact data published within the scope of the imprint obligation by third parties for the purpose of sending advertising and information materials not expressly requested is hereby expressly contradicted. The operators of the pages expressly reserve the right to take legal action in the event of the unsolicited sending of advertising information, such as spam mails.</p>
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
