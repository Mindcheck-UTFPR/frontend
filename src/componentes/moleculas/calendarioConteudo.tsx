import {
  Button, Calendar, CalendarCell, CalendarGrid, CalendarGridBody, CalendarGridHeader, CalendarHeaderCell,
  CalendarHeading, CalendarMonthPicker, CalendarYearPicker, Dialog, Heading, I18nProvider,
  ListBox, ListBoxItem, Modal, ModalOverlay, Popover, Select, SelectValue,
} from 'react-aria-components'
import type { CalendarMonthPickerAria } from 'react-aria-components/Calendar'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { IconeInterface } from '../atomos/iconeInterface'
import './seletorData.css'

function lerData(valor?: string) {
  try { return valor ? parseDate(valor) : undefined } catch { return undefined }
}
function EscolhaCalendario(props: CalendarMonthPickerAria) {
  return <Select {...props} className="mc-calendar-select">
    <Button className="mc-calendar-select-trigger"><SelectValue/><IconeInterface nome="baixo" tamanho={16}/></Button>
    <Popover className="mc-calendar-options" placement="bottom start">
      <ListBox className="mc-calendar-list" items={props.items}>{item => <ListBoxItem id={item.id} textValue={item.formatted} className="mc-calendar-option">{({isSelected}) => <><span>{item.formatted}</span>{isSelected && <IconeInterface nome="check" tamanho={16}/>}</>}</ListBoxItem>}</ListBox>
    </Popover>
  </Select>
}
export function CalendarioConteudo({ id, rotulo, valor, aoMudar, aberto, aoAbrir, minimo, maximo }: {
  id: string; rotulo: string; valor: string; aoMudar: (data: string) => void
  aberto: boolean; aoAbrir: (aberto: boolean) => void; minimo?: string; maximo?: string
}) {
  const selecionar = (data: string) => { aoMudar(data); aoAbrir(false) }
  const hoje = today(getLocalTimeZone())
  const min = lerData(minimo), max = lerData(maximo)
  const hojePermitido = (!min || hoje.compare(min) >= 0) && (!max || hoje.compare(max) <= 0)
  return <I18nProvider locale="pt-BR">
    <ModalOverlay isOpen={aberto} onOpenChange={aoAbrir} isDismissable className="mc-date-overlay">
      <Modal className="mc-date-modal"><Dialog className="mc-date-dialog" id={id} aria-label={`Selecionar data: ${rotulo}`}>
        <header className="mc-date-header"><div><p>ESCOLHA UMA DATA</p><Heading slot="title">{rotulo === 'De' ? 'Início do período' : rotulo === 'Até' ? 'Fim do período' : rotulo}</Heading></div><Button className="mc-icon-button" aria-label="Fechar calendário" onPress={() => aoAbrir(false)}><IconeInterface nome="fechar"/></Button></header>
        <Calendar className="mc-calendar" aria-label="Calendário" value={lerData(valor) ?? null} onChange={data => selecionar(data.toString())} minValue={min} maxValue={max} firstDayOfWeek="mon">
          <CalendarHeading className="mc-sr-only"/>
          <div className="mc-calendar-toolbar"><Button slot="previous" className="mc-icon-button" aria-label="Mês anterior"><IconeInterface nome="esquerda"/></Button>
            <CalendarMonthPicker format="long">{props => <EscolhaCalendario {...props}/>}</CalendarMonthPicker>
            <CalendarYearPicker visibleYears={101}>{props => <EscolhaCalendario {...props}/>}</CalendarYearPicker>
            <Button slot="next" className="mc-icon-button" aria-label="Próximo mês"><IconeInterface nome="direita"/></Button>
          </div>
          <CalendarGrid className="mc-calendar-grid" weekdayStyle="short">
            <CalendarGridHeader>{dia => <CalendarHeaderCell className="mc-calendar-weekday">{dia}</CalendarHeaderCell>}</CalendarGridHeader>
            <CalendarGridBody>{dia => <CalendarCell date={dia} className="mc-calendar-day"/>}</CalendarGridBody>
          </CalendarGrid>
        </Calendar>
        <footer className="mc-date-footer"><Button className="mc-date-action" isDisabled={!hojePermitido} onPress={() => selecionar(hoje.toString())}>Hoje</Button><Button className="mc-date-action mc-date-action--quiet" isDisabled={!valor} onPress={() => selecionar('')}>Remover data</Button></footer>
      </Dialog></Modal>
    </ModalOverlay>
  </I18nProvider>
}
