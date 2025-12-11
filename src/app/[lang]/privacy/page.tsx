
import { getDictionary } from '@/dictionaries';
import { SimpleHeader } from '@/components/headers/SimpleHeader';
import { Container } from '@/components/ui/Container';

export default async function PrivacyPage({ params }: { params: { lang: string } }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as 'de' | 'en');

    return (
        <div className="bg-white min-h-screen">
            <SimpleHeader
                title={lang === 'de' ? 'Datenschutz' : 'Privacy Policy'}
                description={lang === 'de' ? 'Informationen zur Verarbeitung Ihrer Daten' : 'Information about data processing'}
            />

            <Container className="py-12 md:py-20 prose prose-lg max-w-4xl prose-slate">
                {lang === 'de' ? (
                    <>
                        <p>Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.</p>

                        <p>Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.</p>

                        <p>Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.</p>

                        <h3>Datenschutzerklärung für die Nutzung von Facebook-Plugins (Like-Button)</h3>
                        <p>Auf unseren Seiten sind Plugins des sozialen Netzwerks Facebook, 1601 South California Avenue, Palo Alto, CA 94304, USA integriert. Die Facebook-Plugins erkennen Sie an dem Facebook-Logo oder dem “Like-Button” (“Gefällt mir”) auf unserer Seite.</p>
                        <p>Wenn Sie unsere Seiten besuchen, wird über das Plugin eine direkte Verbindung zwischen Ihrem Browser und dem Facebook-Server hergestellt. Facebook erhält dadurch die Information, dass Sie mit Ihrer IP-Adresse unsere Seite besucht haben. Wenn Sie den Facebook “Like-Button” anklicken während Sie in Ihrem Facebook-Account eingeloggt sind, können Sie die Inhalte unserer Seiten auf Ihrem Facebook-Profil verlinken. Dadurch kann Facebook den Besuch unserer Seiten Ihrem Benutzerkonto zuordnen. Wir weisen darauf hin, dass wir als Anbieter der Seiten keine Kenntnis vom Inhalt der übermittelten Daten sowie deren Nutzung durch Facebook erhalten.</p>
                        <p>Wenn Sie nicht wünschen, dass Facebook den Besuch unserer Seiten Ihrem Facebook-Nutzerkonto zuordnen kann, loggen Sie sich bitte aus Ihrem Facebook-Benutzerkonto aus.</p>

                        <hr />
                        <p className="text-sm text-slate-500">Quelle: <a href="https://www.e-recht24.de/muster-disclaimer.htm" target="_blank" rel="noopener noreferrer">eRecht24</a></p>
                    </>
                ) : (
                    <>
                        <p>The use of our website is generally possible without providing personal data. Insofar as personal data (e.g. name, address or e-mail addresses) is collected on our pages, this is always done on a voluntary basis as far as possible. This data will not be passed on to third parties without your express consent.</p>
                        <p>We would like to point out that data transmission on the Internet (e.g. when communicating by e-mail) can have security gaps. Complete protection of data against access by third parties is not possible.</p>
                        <p>The use of contact data published within the scope of the imprint obligation by third parties for the purpose of sending advertising and information materials not expressly requested is hereby expressly contradicted. The operators of the pages expressly reserve the right to take legal action in the event of the unsolicited sending of advertising information, such as spam mails.</p>
                    </>
                )}
            </Container>
        </div>
    );
}
