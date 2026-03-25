import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 1rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0;
`;

export const Button = styled.button`
  background-color: ${props => props.primary ? '#4a6eb5' : 'white'};
  color: ${props => props.primary ? 'white' : '#4a6eb5'};
  border: 1px solid #4a6eb5;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: ${props => props.margin || '0'};
  
  &:hover {
    background-color: ${props => props.primary ? '#3a5ea5' : '#f0f4ff'};
  }
  
  &:disabled {
    background-color: #cccccc;
    color: #666666;
    border-color: #cccccc;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    border-color: #4a6eb5;
    outline: none;
  }
`;

export const Select = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    border-color: #4a6eb5;
    outline: none;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

export const FlashcardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

export const Flashcard = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const FlashcardWord = styled.h2`
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.5rem;
`;

export const FlashcardMeaning = styled.p`
  margin-bottom: 1rem;
  color: #555;
`;

export const FlashcardExamples = styled.ul`
  padding-left: 1.5rem;
  margin-bottom: 1rem;
`;

export const FlashcardExample = styled.li`
  margin-bottom: 0.5rem;
  color: #666;
`;

export const FlashcardControls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eaeaea;
`;

export const FlashcardMeta = styled.div`
  color: #999;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

export const TabContainer = styled.div`
  margin-bottom: 2rem;
`;

export const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 1.5rem;
`;

export const TabButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#4a6eb5' : 'transparent'};
  color: ${props => props.$active ? '#4a6eb5' : '#666'};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    color: #4a6eb5;
  }
`;

export const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  &:after {
    content: " ";
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 6px solid #4a6eb5;
    border-color: #4a6eb5 transparent #4a6eb5 transparent;
    animation: loader 1.2s linear infinite;
  }
  
  @keyframes loader {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Error = styled.div`
  color: #d32f2f;
  background-color: #ffebee;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export const Success = styled.div`
  color: #388e3c;
  background-color: #e8f5e9;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

export const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  
  select {
    width: auto;
    min-width: 200px;
    margin-bottom: 0;
  }
`;

export const ViewModeSwitcher = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 1rem;
  margin-left: 1rem;
`;

export const ViewModeButton = styled.button`
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.$active ? '#4a6eb5' : 'white'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: 1px solid ${props => props.$active ? '#4a6eb5' : '#ccc'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$active ? '#3a5ea5' : '#f0f4ff'};
  }
  
  &:first-child {
    border-radius: 4px 0 0 4px;
  }
  
  &:last-child {
    border-radius: 0 4px 4px 0;
  }
`;

export const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const FlashcardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  background-color: white;
  transition: box-shadow 0.2s ease;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

export const ListItemWord = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
  min-width: 200px;
`;

export const ListItemMeaning = styled.span`
  color: #666;
  flex: 1;
  margin: 0 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ListItemMeta = styled.span`
  color: #999;
  font-size: 0.85rem;
  min-width: 120px;
  text-align: right;
`;

export const ListItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
`;

export const ListItemExpanded = styled.div`
  padding: 1rem 0;
  border-top: 1px solid #eaeaea;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ListItemMeaningFull = styled.div`
  color: #555;
  font-size: 1rem;
  line-height: 1.5;
`;

export const ListItemExamples = styled.ul`
  padding-left: 1.5rem;
  margin: 0;
  color: #666;
`;

export const ListItemExample = styled.li`
  margin-bottom: 0.25rem;
`;

export const ListItemCollapsed = styled.div`
  flex: 1;
  margin: 0 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ReviewCard = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: white;
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
`;

export const ReviewWord = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
`;

export const ReviewActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin: 0;
  }
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`; 