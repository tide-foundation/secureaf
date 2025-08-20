import ComplianceLogo from "@/components/ComplianceLogo";
import SocialLinks from "@/components/SocialLinks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTideCloak, Authenticated, Unauthenticated } from '@tidecloak/react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Database, ExternalLink, Zap, EyeOff, Bug } from 'lucide-react';
export default function Index() {
  const {
    login,
    logout
  } = useTideCloak();
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <header className="container mx-auto px-6 py-8 text-center relative">
        <Authenticated>
          <div className="absolute top-4 right-4">
            <Button onClick={logout} variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
              Logout
            </Button>
          </div>
        </Authenticated>
        <div className="flex justify-center mb-6">
          <img src="/lovable-uploads/ca0765a4-841c-4280-a13a-395e55fa67ed.png" alt="Secure AF - Neon logo with padlock and sunglasses" className="h-48 w-auto" />
        </div>
        <h2 className="text-3xl font-bold mb-8 text-center">
              Vibe <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Coded.</span> Provably <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Secure.</span>
            </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              A personal vault for notes and files, entirely vibe coded.<br />Secure by{" "}
              <a href="https://tidecloak.com" target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:text-neon-cyan transition-colors underline">
                TideCloak
              </a>{" "}
              with keys no-one will ever hold.
        </p>

        <Unauthenticated>
          <div className="space-y-2 mb-12">
            <Button onClick={login} variant="neon" size="lg" className="text-lg px-8 py-4 mb-2">
          <Zap className="mr-1" />
          Enter your vault
        </Button>

            <p className="text-sm text-muted-foreground italic">
              Because no-one else can
            </p>
          </div>
        </Unauthenticated>

        <Authenticated>
          <div className="space-y-6 mb-12">
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/vault')} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4">
                <Database className="w-5 h-5 mr-2" />
                Open Vault
              </Button>
              <Button onClick={logout} size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-4">
                Logout
              </Button>
            </div>
          </div>
        </Authenticated>
      </header>

      <main className="container mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <EyeOff className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Zero knowledge auth</h3>
            <p className="text-muted-foreground">Your password is never stored or exposed.</p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">True Zero Trust</h3>
            <p className="text-muted-foreground">Your data is encrypted with a key trusted to no-one. Especially us.</p>
            
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Bug className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Zero quality assurance</h3>
            <p className="text-muted-foreground">We've barely tested this app. DON'T really use it!</p>
          </div>
        </div>

        {/* What is PrivAF? */}
        

        {/* Trust me bro */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              Compliance ≠ <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">security</span>
            </h2>
            
            <div className="grid gap-8 mb-12">
              

              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="font-semibold mb-4 flex items-center justify-center gap-2">(Not) certified with:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                  <ComplianceLogo name="ISO27001:2022" imageSrc="/lovable-uploads/556a1445-7570-4178-90d8-44351d2125a0.png" />
                  <ComplianceLogo name="HIPAA" imageSrc="/lovable-uploads/373a52d7-7db5-4d14-9b9b-f9d1f638110a.png" />
                  <ComplianceLogo name="SOC 2" imageSrc="/lovable-uploads/81c16bd4-6177-4650-80f7-7619a0195b20.png" />
                  <ComplianceLogo name="GDPR" imageSrc="/lovable-uploads/5b6a3904-e36c-4ff2-84f7-bb1c6f11e947.png" />
                  <ComplianceLogo name="PCI DSS" imageSrc="/lovable-uploads/6396ad59-1c05-46e6-9a8d-315015d0c67d.png" />
                  <ComplianceLogo name="FedRAMP" imageSrc="/lovable-uploads/e8de0929-f1ff-4653-9a55-33b985b0fda8.png" />
                </div>
                <p className="text-sm text-muted-foreground italic text-center">
                  Because your data deserves better than "trust me bro".
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Try TideCloak */}
        

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              Frequently Asked <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Questions</span>
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                
                
                <AccordionItem value="production-ready" className="border border-border/50 rounded-lg px-6">
                  <AccordionTrigger className="text-left">Can I actually use SecureAF?</AccordionTrigger>
                  <AccordionContent>
                    Hell No! We did this in 20 min and never tested it. What's wrong with you?
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="what-is-secureaf" className="border border-border/50 rounded-lg px-6">
                  <AccordionTrigger className="text-left">Then why did you build it?</AccordionTrigger>
                  <AccordionContent>
                    We just wanted to see if it would work! Also, someone needs to save the next <a href="https://www.nbcnews.com/tech/social-media/10-women-sued-tea-app-photos-hacked-leaked-online-rcna222880" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors underline">dating app</a> from itself.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="what-is-tidecloak" className="border border-border/50 rounded-lg px-6">
                  <AccordionTrigger className="text-left">What's TideCloak and why it is any different?</AccordionTrigger>
                  <AccordionContent>
                    How about we <a href="https://chatgpt.com/share/68a41594-0708-800f-8020-3ca06a2c164e" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors underline">vibe answer that for you</a>.
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-16 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col sm:flex-row gap-6">
              <a href="https://tidecloak.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <Shield size={16} />
                Secure by TideCloak
              </a>
              <a href="https://tide.org/alpha" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <ExternalLink size={16} />
                Join the Alpha
              </a>
            </div>
            <SocialLinks />
          </div>
          <div className="text-center mt-8 text-xs text-muted-foreground">
            <p>Vibed with 💜(able) and available on{" "}
                    <a href="https://github.com/tide-foundation/secureaf" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors underline">
                      GitHub
                    </a></p>
          </div>
        </div>
      </footer>
    </div>;
}