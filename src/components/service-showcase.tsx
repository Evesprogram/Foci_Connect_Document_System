import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Cpu, Bot } from 'lucide-react';

const services = [
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: 'Engineering',
    description: 'Providing innovative and reliable engineering solutions across various sectors to build a sustainable future.',
  },
  {
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: 'ICT',
    description: 'Delivering cutting-edge Information and Communication Technology services to optimize your business operations.',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'Smart Automation',
    description: 'Implementing intelligent automation systems to enhance productivity, efficiency, and safety.',
  },
];

export function ServiceShowcase() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-headline font-bold text-center">Our Core Services</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title} className="text-center transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                {service.icon}
              </div>
              <CardTitle className="font-headline pt-4">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
