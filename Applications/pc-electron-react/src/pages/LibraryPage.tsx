import { PageHeader } from '@/components/PageHeader';
import { BiblioMots } from '@/components/bibliotheques/mots/BiblioMots';
import { BiblioInterets } from '@/components/bibliotheques/interets/BiblioInterets';
import { BiblioSounds } from '@/components/bibliotheques/sons/BiblioSons';
import { BiblioImages } from '@/components/bibliotheques/images/BiblioImages';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LibraryPage() {
  return (
    <>
      <PageHeader title="Bibliothèque" />
      <Tabs defaultValue="mots" className="w-full">
        <TabsList>
          <TabsTrigger value="mots">Mots</TabsTrigger>
          <TabsTrigger value="Images">Images</TabsTrigger>
          <TabsTrigger value="sons">Sons</TabsTrigger>
          <TabsTrigger value="Interets">Centres d&apos;intérêts</TabsTrigger>
        </TabsList>

        <TabsContent value="mots">
          <BiblioMots />
        </TabsContent>
        <TabsContent value="Images">
          <BiblioImages />
        </TabsContent>
        <TabsContent value="sons">
          <BiblioSounds />
        </TabsContent>
        <TabsContent value="Interets">
          <BiblioInterets />
        </TabsContent>
      </Tabs>
    </>
  );
}
